#!/usr/bin/env python3
"""
Progress Analyzer Script
Analyzes user progress data and generates insights for Project Hampton
"""

import json
import os
import sys
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import click
import pandas as pd
import numpy as np
from collections import defaultdict
import base64
import matplotlib.pyplot as plt
import seaborn as sns

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class ProgressAnalyzer:
    def __init__(self, data_dir: str = "data"):
        """Initialize the progress analyzer."""
        self.data_dir = Path(data_dir)
        self.analytics_dir = self.data_dir / "analytics"
        self.exports_dir = self.data_dir / "exports"
        
        # Create directories if they don't exist
        self.analytics_dir.mkdir(parents=True, exist_ok=True)
        self.exports_dir.mkdir(parents=True, exist_ok=True)
        
        self.progress_data = []
        self.analytics = {}
        
    def decode_progress_code(self, code: str) -> Optional[Dict]:
        """Decode a progress code to extract user data."""
        try:
            # Format: HAMPTON-PROJ-W#M#-XXXX-YYYY
            parts = code.upper().strip().split('-')
            
            if len(parts) != 5 or parts[0] != 'HAMPTON':
                return None
            
            project_map = {
                'DASH': 'dashboard',
                'BLOG': 'blog',
                'AUTO': 'automation'
            }
            
            project = project_map.get(parts[1], 'unknown')
            
            # Parse week and module
            week_module = parts[2]
            if week_module.startswith('W') and 'M' in week_module:
                week_part, module_part = week_module[1:].split('M')
                week = int(week_part)
                module = int(module_part)
            else:
                week = module = 0
            
            return {
                'code': code,
                'project': project,
                'week': week,
                'module': module,
                'checksum': parts[3],
                'data': parts[4],
                'decoded_at': datetime.now().isoformat()
            }
        except Exception as e:
            click.echo(f"Error decoding {code}: {e}", err=True)
            return None
    
    def analyze_progress_codes(self, codes: List[str]) -> Dict:
        """Analyze a list of progress codes."""
        decoded = [self.decode_progress_code(code) for code in codes]
        valid_codes = [d for d in decoded if d is not None]
        
        if not valid_codes:
            return {'error': 'No valid codes found'}
        
        df = pd.DataFrame(valid_codes)
        
        analytics = {
            'total_codes': len(codes),
            'valid_codes': len(valid_codes),
            'invalid_codes': len(codes) - len(valid_codes),
            'project_distribution': df['project'].value_counts().to_dict(),
            'average_week': df['week'].mean(),
            'average_module': df['module'].mean(),
            'furthest_progress': {
                'week': df['week'].max(),
                'module': df.loc[df['week'] == df['week'].max(), 'module'].max()
            },
            'completion_rate': (df['week'] * 5 + df['module']).mean() / 40 * 100  # 40 total modules
        }
        
        return analytics
    
    def generate_user_report(self, progress_code: str) -> Dict:
        """Generate a detailed report for a single user."""
        decoded = self.decode_progress_code(progress_code)
        
        if not decoded:
            return {'error': 'Invalid progress code'}
        
        total_modules = (decoded['week'] - 1) * 5 + decoded['module']
        total_possible = 40  # 8 weeks * 5 modules
        
        report = {
            'user_progress': decoded,
            'statistics': {
                'modules_completed': total_modules,
                'total_modules': total_possible,
                'completion_percentage': (total_modules / total_possible) * 100,
                'estimated_xp': total_modules * 100,  # Base XP per module
                'estimated_level': int(np.sqrt(total_modules * 100 / 50)) + 1
            },
            'recommendations': self.generate_recommendations(decoded),
            'estimated_completion': self.estimate_completion_date(decoded),
            'next_milestone': self.get_next_milestone(decoded)
        }
        
        return report
    
    def generate_recommendations(self, user_data: Dict) -> List[str]:
        """Generate personalized recommendations based on progress."""
        recommendations = []
        
        week = user_data['week']
        module = user_data['module']
        project = user_data['project']
        
        # Progress-based recommendations
        if week <= 2:
            recommendations.append("Focus on mastering the fundamentals - they're crucial for later weeks")
            recommendations.append("Don't hesitate to use AI assistance extensively while learning")
        elif week <= 4:
            recommendations.append("Start integrating more complex features into your project")
            recommendations.append("This is a good time to refactor early code with your new knowledge")
        elif week <= 6:
            recommendations.append("Focus on optimization and best practices")
            recommendations.append("Consider adding optional advanced features to challenge yourself")
        else:
            recommendations.append("You're in the final stretch! Focus on polish and deployment")
            recommendations.append("Document your project thoroughly for your portfolio")
        
        # Project-specific recommendations
        if project == 'dashboard':
            recommendations.append("Explore additional data visualization libraries for richer displays")
        elif project == 'blog':
            recommendations.append("Consider implementing SEO best practices early")
        elif project == 'automation':
            recommendations.append("Test your bots thoroughly in development environments")
        
        # Module-specific recommendations
        if module == 5:
            recommendations.append("Complete the weekly project to solidify your learning")
        elif module == 1:
            recommendations.append("Take time to plan before diving into implementation")
        
        return recommendations
    
    def estimate_completion_date(self, user_data: Dict, pace: str = "normal") -> Dict:
        """Estimate completion date based on current progress and pace."""
        
        pace_days = {
            "fast": 2,      # 2 days per module
            "normal": 3,    # 3 days per module
            "relaxed": 5,   # 5 days per module
            "weekend": 7    # Weekend warrior - 1 module per week
        }
        
        current_position = (user_data['week'] - 1) * 5 + user_data['module']
        remaining_modules = 40 - current_position
        
        estimates = {}
        for pace_name, days_per_module in pace_days.items():
            days_remaining = remaining_modules * days_per_module
            completion_date = datetime.now() + timedelta(days=days_remaining)
            estimates[pace_name] = {
                'date': completion_date.strftime('%Y-%m-%d'),
                'days_remaining': days_remaining,
                'weeks_remaining': round(days_remaining / 7, 1)
            }
        
        return estimates
    
    def get_next_milestone(self, user_data: Dict) -> Dict:
        """Get the next major milestone for the user."""
        
        week = user_data['week']
        module = user_data['module']
        
        milestones = [
            (1, 5, "Complete Week 1", "Foundation Complete"),
            (2, 5, "Complete Week 2", "Basic Structure Built"),
            (3, 5, "Complete Week 3", "Core Functionality Done"),
            (4, 5, "Complete Week 4", "Halfway There!"),
            (5, 5, "Complete Week 5", "Advanced Features Added"),
            (6, 5, "Complete Week 6", "Data Layer Complete"),
            (7, 5, "Complete Week 7", "Almost There!"),
            (8, 5, "Complete Week 8", "Project Complete! 🎓")
        ]
        
        for milestone_week, milestone_module, name, description in milestones:
            if week < milestone_week or (week == milestone_week and module < milestone_module):
                modules_until = (milestone_week - week) * 5 + (milestone_module - module)
                return {
                    'name': name,
                    'description': description,
                    'week': milestone_week,
                    'module': milestone_module,
                    'modules_remaining': modules_until
                }
        
        return {
            'name': 'Course Complete',
            'description': 'Congratulations! You\'ve completed the course!',
            'modules_remaining': 0
        }
    
    def generate_analytics_dashboard(self, data: List[Dict]) -> None:
        """Generate visual analytics dashboard."""
        
        if not data:
            click.echo("No data to visualize", err=True)
            return
        
        df = pd.DataFrame(data)
        
        # Set up the plot style
        sns.set_style("whitegrid")
        fig, axes = plt.subplots(2, 2, figsize=(15, 10))
        fig.suptitle('Project Hampton - Progress Analytics', fontsize=16)
        
        # 1. Project Distribution
        if 'project' in df.columns:
            project_counts = df['project'].value_counts()
            axes[0, 0].pie(project_counts.values, labels=project_counts.index, autopct='%1.1f%%')
            axes[0, 0].set_title('Project Distribution')
        
        # 2. Progress Distribution
        if 'week' in df.columns:
            axes[0, 1].hist(df['week'], bins=8, edgecolor='black')
            axes[0, 1].set_xlabel('Week')
            axes[0, 1].set_ylabel('Number of Users')
            axes[0, 1].set_title('User Progress Distribution')
            axes[0, 1].set_xticks(range(1, 9))
        
        # 3. Completion Rate by Project
        if 'project' in df.columns and 'week' in df.columns:
            completion_by_project = df.groupby('project').agg({
                'week': 'mean',
                'module': 'mean'
            })
            completion_by_project['completion_rate'] = (completion_by_project['week'] * 5 + completion_by_project['module']) / 40 * 100
            
            axes[1, 0].bar(completion_by_project.index, completion_by_project['completion_rate'])
            axes[1, 0].set_ylabel('Completion Rate (%)')
            axes[1, 0].set_title('Average Completion by Project')
        
        # 4. Module Progress Heatmap
        if 'week' in df.columns and 'module' in df.columns:
            progress_matrix = np.zeros((8, 5))
            for _, row in df.iterrows():
                week = int(row['week']) - 1
                module = int(row['module']) - 1
                if 0 <= week < 8 and 0 <= module < 5:
                    progress_matrix[week, module] += 1
            
            im = axes[1, 1].imshow(progress_matrix, cmap='YlOrRd', aspect='auto')
            axes[1, 1].set_xlabel('Module')
            axes[1, 1].set_ylabel('Week')
            axes[1, 1].set_title('Module Completion Heatmap')
            axes[1, 1].set_xticks(range(5))
            axes[1, 1].set_yticks(range(8))
            axes[1, 1].set_xticklabels([f'M{i+1}' for i in range(5)])
            axes[1, 1].set_yticklabels([f'W{i+1}' for i in range(8)])
            plt.colorbar(im, ax=axes[1, 1])
        
        plt.tight_layout()
        
        # Save the dashboard
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        dashboard_path = self.analytics_dir / f'dashboard_{timestamp}.png'
        plt.savefig(dashboard_path, dpi=150, bbox_inches='tight')
        click.echo(f"✓ Dashboard saved to {dashboard_path}")
        
        plt.show()
    
    def export_data(self, data: Any, format: str, filename: str = None) -> Path:
        """Export data in various formats."""
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = filename or f'progress_export_{timestamp}'
        
        if format == 'json':
            filepath = self.exports_dir / f'{filename}.json'
            with open(filepath, 'w') as f:
                json.dump(data, f, indent=2, default=str)
        
        elif format == 'csv':
            filepath = self.exports_dir / f'{filename}.csv'
            if isinstance(data, list):
                df = pd.DataFrame(data)
            elif isinstance(data, dict):
                df = pd.DataFrame([data])
            else:
                df = data
            df.to_csv(filepath, index=False)
        
        elif format == 'excel':
            filepath = self.exports_dir / f'{filename}.xlsx'
            if isinstance(data, list):
                df = pd.DataFrame(data)
            elif isinstance(data, dict):
                df = pd.DataFrame([data])
            else:
                df = data
            df.to_excel(filepath, index=False)
        
        elif format == 'html':
            filepath = self.exports_dir / f'{filename}.html'
            if isinstance(data, list):
                df = pd.DataFrame(data)
            elif isinstance(data, dict):
                df = pd.DataFrame([data])
            else:
                df = data
            
            html = df.to_html(classes='table table-striped', index=False)
            with open(filepath, 'w') as f:
                f.write(f"""
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Progress Report - {timestamp}</title>
                    <style>
                        body {{ font-family: Arial, sans-serif; margin: 20px; }}
                        table {{ border-collapse: collapse; width: 100%; }}
                        th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
                        th {{ background-color: #001689; color: white; }}
                        tr:nth-child(even) {{ background-color: #f2f2f2; }}
                    </style>
                </head>
                <body>
                    <h1>Project Hampton - Progress Report</h1>
                    <p>Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
                    {html}
                </body>
                </html>
                """)
        
        else:
            raise ValueError(f"Unsupported format: {format}")
        
        return filepath

@click.command()
@click.option('--code', '-c', help='Analyze a single progress code')
@click.option('--codes-file', '-f', help='File containing progress codes (one per line)')
@click.option('--export-format', '-e', 
              type=click.Choice(['json', 'csv', 'excel', 'html']), 
              default='json', help='Export format')
@click.option('--visualize', '-v', is_flag=True, help='Generate visual analytics')
@click.option('--report', '-r', is_flag=True, help='Generate detailed report')
def main(code, codes_file, export_format, visualize, report):
    """Analyze Project Hampton progress codes and generate insights."""
    
    analyzer = ProgressAnalyzer()
    
    click.echo("📊 Project Hampton Progress Analyzer")
    click.echo("=" * 40)
    
    if code:
        # Single code analysis
        click.echo(f"\nAnalyzing code: {code}")
        
        if report:
            result = analyzer.generate_user_report(code)
            
            # Display report
            click.echo("\n📈 User Progress Report")
            click.echo("-" * 30)
            
            if 'error' in result:
                click.echo(f"❌ {result['error']}", err=True)
            else:
                stats = result['statistics']
                click.echo(f"Project: {result['user_progress']['project'].title()}")
                click.echo(f"Current Position: Week {result['user_progress']['week']}, Module {result['user_progress']['module']}")
                click.echo(f"Completion: {stats['completion_percentage']:.1f}%")
                click.echo(f"Estimated Level: {stats['estimated_level']}")
                click.echo(f"Estimated XP: {stats['estimated_xp']}")
                
                click.echo("\n🎯 Next Milestone:")
                milestone = result['next_milestone']
                click.echo(f"  {milestone['name']}: {milestone['modules_remaining']} modules remaining")
                
                click.echo("\n💡 Recommendations:")
                for rec in result['recommendations'][:3]:
                    click.echo(f"  • {rec}")
                
                click.echo("\n📅 Estimated Completion:")
                for pace, estimate in result['estimated_completion'].items():
                    if pace == 'normal':
                        click.echo(f"  {pace.title()}: {estimate['date']} ({estimate['weeks_remaining']} weeks)")
            
            # Export if requested
            if export_format:
                filepath = analyzer.export_data(result, export_format)
                click.echo(f"\n✅ Report exported to {filepath}")
        else:
            decoded = analyzer.decode_progress_code(code)
            if decoded:
                click.echo(f"✓ Valid code")
                click.echo(f"  Project: {decoded['project']}")
                click.echo(f"  Progress: Week {decoded['week']}, Module {decoded['module']}")
            else:
                click.echo("✗ Invalid code", err=True)
    
    elif codes_file:
        # Multiple codes analysis
        click.echo(f"\nAnalyzing codes from: {codes_file}")
        
        try:
            with open(codes_file, 'r') as f:
                codes = [line.strip() for line in f if line.strip()]
            
            click.echo(f"Found {len(codes)} codes")
            
            # Decode all codes
            decoded_codes = []
            for code in codes:
                decoded = analyzer.decode_progress_code(code)
                if decoded:
                    decoded_codes.append(decoded)
            
            # Generate analytics
            analytics = analyzer.analyze_progress_codes(codes)
            
            click.echo("\n📊 Analytics Summary")
            click.echo("-" * 30)
            click.echo(f"Valid Codes: {analytics['valid_codes']}/{analytics['total_codes']}")
            click.echo(f"Average Completion: {analytics['completion_rate']:.1f}%")
            click.echo(f"Average Position: Week {analytics['average_week']:.1f}")
            
            click.echo("\n🎯 Project Distribution:")
            for project, count in analytics['project_distribution'].items():
                click.echo(f"  {project.title()}: {count} users")
            
            # Visualize if requested
            if visualize and decoded_codes:
                analyzer.generate_analytics_dashboard(decoded_codes)
            
            # Export
            export_data = {
                'analytics': analytics,
                'codes': decoded_codes
            }
            filepath = analyzer.export_data(export_data, export_format)
            click.echo(f"\n✅ Analytics exported to {filepath}")
            
        except FileNotFoundError:
            click.echo(f"❌ File not found: {codes_file}", err=True)
    
    else:
        click.echo("\nUsage:")
        click.echo("  Analyze single code: python progress_analyzer.py -c HAMPTON-DASH-W3M2-XXXX-YYYY")
        click.echo("  Analyze multiple codes: python progress_analyzer.py -f codes.txt")
        click.echo("  Generate report: python progress_analyzer.py -c [CODE] -r")
        click.echo("  Visualize data: python progress_analyzer.py -f codes.txt -v")

if __name__ == "__main__":
    main()