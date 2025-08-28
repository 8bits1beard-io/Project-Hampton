#!/usr/bin/env python3
"""
Content Validator Script
Validates course content structure and completeness for Project Hampton
"""

import json
import os
import sys
from pathlib import Path
from typing import Dict, List, Any, Tuple
import click
import yaml
from jsonschema import validate, ValidationError
import re
from datetime import datetime

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class ContentValidator:
    def __init__(self, content_dir: str = "content"):
        """Initialize the content validator."""
        self.content_dir = Path(content_dir)
        self.errors = []
        self.warnings = []
        self.info = []
        
        # Define the schema for module content
        self.module_schema = {
            "type": "object",
            "required": ["week", "title", "description", "modules"],
            "properties": {
                "week": {"type": "integer", "minimum": 1, "maximum": 8},
                "title": {"type": "string", "minLength": 1},
                "description": {"type": "string", "minLength": 1},
                "modules": {
                    "type": "array",
                    "minItems": 5,
                    "maxItems": 5,
                    "items": {
                        "type": "object",
                        "required": ["id", "number", "title", "duration", "difficulty", "xp", "skills", "objectives", "content"],
                        "properties": {
                            "id": {"type": "string", "pattern": "^w[1-8]m[1-5]$"},
                            "number": {"type": "integer", "minimum": 1, "maximum": 5},
                            "title": {"type": "string", "minLength": 1},
                            "duration": {"type": "string"},
                            "difficulty": {"type": "string", "enum": ["beginner", "intermediate", "advanced"]},
                            "xp": {"type": "integer", "minimum": 0},
                            "skills": {"type": "array", "items": {"type": "string"}},
                            "objectives": {"type": "array", "items": {"type": "string"}},
                            "content": {"type": "object"}
                        }
                    }
                },
                "week_summary": {
                    "type": "object",
                    "properties": {
                        "total_xp": {"type": "integer"},
                        "skills_developed": {"type": "array"},
                        "projects_completed": {"type": "integer"},
                        "estimated_time": {"type": "string"},
                        "achievement_available": {"type": "string"}
                    }
                }
            }
        }
    
    def validate_json_structure(self, file_path: Path) -> bool:
        """Validate JSON file structure against schema."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            validate(instance=data, schema=self.module_schema)
            return True
            
        except json.JSONDecodeError as e:
            self.errors.append(f"JSON decode error in {file_path}: {e}")
            return False
        except ValidationError as e:
            self.errors.append(f"Schema validation error in {file_path}: {e.message}")
            return False
        except Exception as e:
            self.errors.append(f"Error reading {file_path}: {e}")
            return False
    
    def validate_week_content(self, week: int) -> Dict[str, Any]:
        """Validate content for a specific week."""
        week_dir = self.content_dir / f"week{week}"
        results = {
            'week': week,
            'exists': week_dir.exists(),
            'files': [],
            'valid': True,
            'issues': []
        }
        
        if not week_dir.exists():
            self.errors.append(f"Week {week} directory not found")
            results['valid'] = False
            return results
        
        # Check for required files
        required_files = ['modules.json']
        optional_files = ['modules_dashboard.json', 'modules_blog.json', 'modules_automation.json']
        
        for file_name in required_files + optional_files:
            file_path = week_dir / file_name
            if file_path.exists():
                results['files'].append(file_name)
                if self.validate_json_structure(file_path):
                    self.info.append(f"✓ {file_path} is valid")
                else:
                    results['valid'] = False
                    results['issues'].append(f"Invalid structure in {file_name}")
        
        # Check if at least one required file exists
        if not any(f in results['files'] for f in required_files):
            if not any(f in results['files'] for f in optional_files):
                self.errors.append(f"No module files found in week {week}")
                results['valid'] = False
        
        return results
    
    def validate_links(self, content: Dict) -> List[str]:
        """Check for broken links in content."""
        broken_links = []
        
        # Extract all URLs from content
        def extract_urls(obj):
            urls = []
            if isinstance(obj, dict):
                for value in obj.values():
                    urls.extend(extract_urls(value))
            elif isinstance(obj, list):
                for item in obj:
                    urls.extend(extract_urls(item))
            elif isinstance(obj, str):
                # Find URLs in string
                url_pattern = r'https?://[^\s<>"{}|\\^`\[\]]+'
                urls.extend(re.findall(url_pattern, obj))
            return urls
        
        urls = extract_urls(content)
        
        # For now, just check URL format (in production, you'd check if they're accessible)
        for url in urls:
            if not url.startswith(('http://', 'https://')):
                broken_links.append(url)
        
        return broken_links
    
    def validate_code_examples(self, content: Dict) -> List[Dict]:
        """Validate code examples in content."""
        issues = []
        
        def check_code_blocks(obj, path=""):
            if isinstance(obj, dict):
                for key, value in obj.items():
                    if key in ['code', 'solution', 'example']:
                        # Basic syntax check
                        if isinstance(value, str) and value.strip():
                            # Check for common syntax issues
                            if value.count('(') != value.count(')'):
                                issues.append({
                                    'path': f"{path}.{key}",
                                    'issue': 'Unbalanced parentheses'
                                })
                            if value.count('{') != value.count('}'):
                                issues.append({
                                    'path': f"{path}.{key}",
                                    'issue': 'Unbalanced braces'
                                })
                            if value.count('[') != value.count(']'):
                                issues.append({
                                    'path': f"{path}.{key}",
                                    'issue': 'Unbalanced brackets'
                                })
                    else:
                        check_code_blocks(value, f"{path}.{key}")
            elif isinstance(obj, list):
                for i, item in enumerate(obj):
                    check_code_blocks(item, f"{path}[{i}]")
        
        check_code_blocks(content)
        return issues
    
    def validate_progression(self) -> bool:
        """Validate that content progresses logically through weeks."""
        valid = True
        
        # Check difficulty progression
        difficulties = []
        for week in range(1, 9):
            week_file = self.content_dir / f"week{week}" / "modules.json"
            if week_file.exists():
                try:
                    with open(week_file, 'r') as f:
                        data = json.load(f)
                    
                    week_difficulties = [m['difficulty'] for m in data.get('modules', [])]
                    difficulties.append((week, week_difficulties))
                    
                    # Check that difficulty increases over time
                    if week <= 2 and 'advanced' in week_difficulties:
                        self.warnings.append(f"Week {week} contains advanced content (might be too early)")
                    elif week >= 7 and all(d == 'beginner' for d in week_difficulties):
                        self.warnings.append(f"Week {week} only contains beginner content (should be more advanced)")
                    
                except Exception as e:
                    self.errors.append(f"Error checking progression for week {week}: {e}")
                    valid = False
        
        return valid
    
    def validate_xp_balance(self) -> Dict:
        """Check if XP distribution is balanced across weeks."""
        xp_data = {}
        total_xp = 0
        
        for week in range(1, 9):
            week_file = self.content_dir / f"week{week}" / "modules.json"
            if week_file.exists():
                try:
                    with open(week_file, 'r') as f:
                        data = json.load(f)
                    
                    week_xp = sum(m.get('xp', 0) for m in data.get('modules', []))
                    xp_data[f"week{week}"] = week_xp
                    total_xp += week_xp
                    
                    # Check if week summary matches calculated XP
                    summary_xp = data.get('week_summary', {}).get('total_xp', 0)
                    if summary_xp != week_xp:
                        self.warnings.append(
                            f"Week {week} XP mismatch: calculated={week_xp}, summary={summary_xp}"
                        )
                    
                except Exception as e:
                    self.errors.append(f"Error checking XP for week {week}: {e}")
        
        # Check for reasonable XP progression
        if xp_data:
            avg_xp = total_xp / len(xp_data)
            for week, xp in xp_data.items():
                if xp < avg_xp * 0.5:
                    self.warnings.append(f"{week} has unusually low XP ({xp})")
                elif xp > avg_xp * 2:
                    self.warnings.append(f"{week} has unusually high XP ({xp})")
        
        return {
            'total_xp': total_xp,
            'average_per_week': avg_xp if xp_data else 0,
            'distribution': xp_data
        }
    
    def validate_skills_coverage(self) -> Dict:
        """Ensure all necessary skills are covered."""
        required_skills = [
            'ai_prompting', 'git', 'html', 'css', 'javascript',
            'debugging', 'deployment', 'databases'
        ]
        
        skill_coverage = {skill: [] for skill in required_skills}
        uncovered_skills = set(required_skills)
        
        for week in range(1, 9):
            week_file = self.content_dir / f"week{week}" / "modules.json"
            if week_file.exists():
                try:
                    with open(week_file, 'r') as f:
                        data = json.load(f)
                    
                    for module in data.get('modules', []):
                        for skill in module.get('skills', []):
                            if skill in skill_coverage:
                                skill_coverage[skill].append(f"w{week}m{module['number']}")
                                uncovered_skills.discard(skill)
                    
                except Exception as e:
                    self.errors.append(f"Error checking skills for week {week}: {e}")
        
        # Report uncovered skills
        if uncovered_skills:
            self.warnings.append(f"Skills not covered: {', '.join(uncovered_skills)}")
        
        # Check for balanced skill distribution
        for skill, modules in skill_coverage.items():
            if len(modules) == 0:
                self.errors.append(f"Skill '{skill}' is not taught in any module")
            elif len(modules) == 1:
                self.warnings.append(f"Skill '{skill}' is only taught once ({modules[0]})")
        
        return skill_coverage
    
    def generate_report(self) -> str:
        """Generate a validation report."""
        report = []
        report.append("=" * 60)
        report.append("PROJECT HAMPTON CONTENT VALIDATION REPORT")
        report.append("=" * 60)
        report.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append("")
        
        # Summary
        report.append("SUMMARY")
        report.append("-" * 30)
        report.append(f"✓ Info Messages: {len(self.info)}")
        report.append(f"⚠ Warnings: {len(self.warnings)}")
        report.append(f"✗ Errors: {len(self.errors)}")
        report.append("")
        
        # Errors
        if self.errors:
            report.append("ERRORS (Must Fix)")
            report.append("-" * 30)
            for error in self.errors:
                report.append(f"  ✗ {error}")
            report.append("")
        
        # Warnings
        if self.warnings:
            report.append("WARNINGS (Should Review)")
            report.append("-" * 30)
            for warning in self.warnings:
                report.append(f"  ⚠ {warning}")
            report.append("")
        
        # Info
        if self.info and len(self.info) <= 20:  # Only show if not too many
            report.append("INFO")
            report.append("-" * 30)
            for info in self.info:
                report.append(f"  ℹ {info}")
            report.append("")
        
        # Result
        report.append("VALIDATION RESULT")
        report.append("-" * 30)
        if not self.errors:
            report.append("✅ PASSED - Content is valid!")
        else:
            report.append("❌ FAILED - Please fix errors above")
        
        return "\n".join(report)
    
    def validate_all(self) -> bool:
        """Run all validation checks."""
        click.echo("Starting content validation...")
        
        # Check each week
        click.echo("\n📁 Validating week directories...")
        for week in range(1, 9):
            results = self.validate_week_content(week)
            if results['valid']:
                click.echo(f"  ✓ Week {week}")
            else:
                click.echo(f"  ✗ Week {week} - {len(results['issues'])} issues")
        
        # Check progression
        click.echo("\n📈 Validating difficulty progression...")
        if self.validate_progression():
            click.echo("  ✓ Progression is logical")
        
        # Check XP balance
        click.echo("\n💰 Validating XP distribution...")
        xp_data = self.validate_xp_balance()
        click.echo(f"  Total XP: {xp_data['total_xp']}")
        click.echo(f"  Average per week: {xp_data['average_per_week']:.0f}")
        
        # Check skills coverage
        click.echo("\n🎯 Validating skills coverage...")
        skills = self.validate_skills_coverage()
        covered = sum(1 for modules in skills.values() if modules)
        click.echo(f"  Skills covered: {covered}/{len(skills)}")
        
        return len(self.errors) == 0

@click.command()
@click.option('--week', '-w', type=int, help='Validate specific week (1-8)')
@click.option('--all', '-a', is_flag=True, help='Validate all content')
@click.option('--fix', is_flag=True, help='Attempt to fix common issues')
@click.option('--output', '-o', help='Save report to file')
@click.option('--verbose', '-v', is_flag=True, help='Show detailed output')
def main(week, all, fix, output, verbose):
    """Validate Project Hampton course content."""
    
    validator = ContentValidator()
    
    click.echo("🔍 Project Hampton Content Validator")
    click.echo("=" * 40)
    
    if week:
        # Validate specific week
        click.echo(f"\nValidating Week {week}...")
        results = validator.validate_week_content(week)
        
        if results['valid']:
            click.echo(f"✅ Week {week} is valid!")
        else:
            click.echo(f"❌ Week {week} has issues:")
            for issue in results['issues']:
                click.echo(f"  - {issue}")
    
    elif all:
        # Validate everything
        valid = validator.validate_all()
        
        # Generate report
        report = validator.generate_report()
        
        if verbose or not valid:
            click.echo("\n" + report)
        
        # Save report if requested
        if output:
            with open(output, 'w') as f:
                f.write(report)
            click.echo(f"\n📄 Report saved to {output}")
        
        # Exit with appropriate code
        sys.exit(0 if valid else 1)
    
    else:
        click.echo("\nUsage:")
        click.echo("  Validate all content: python content_validator.py --all")
        click.echo("  Validate specific week: python content_validator.py --week 1")
        click.echo("  Save report: python content_validator.py --all --output report.txt")
        click.echo("\nUse --help for more options")

if __name__ == "__main__":
    main()