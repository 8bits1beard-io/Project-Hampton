#!/usr/bin/env python3
"""
Content Generator Script
Generates course content templates and structure for Project Hampton
"""

import json
import os
import sys
from pathlib import Path
import click
import yaml
from jinja2 import Template
from datetime import datetime
from typing import Dict, List, Any

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

class ContentGenerator:
    def __init__(self, config_path: str = "scripts/config.yaml"):
        """Initialize the content generator with configuration."""
        self.config = self.load_config(config_path)
        self.content_dir = Path(self.config['paths']['content'])
        self.templates_dir = Path("scripts/templates")
        
    def load_config(self, path: str) -> Dict:
        """Load configuration from YAML file."""
        try:
            with open(path, 'r') as f:
                return yaml.safe_load(f)
        except FileNotFoundError:
            # Return default config if file doesn't exist
            return {
                'paths': {
                    'content': 'content',
                    'data': 'data',
                    'exports': 'data/exports'
                },
                'project': {
                    'name': 'Project Hampton',
                    'version': '0.0.2'
                }
            }
    
    def generate_week_structure(self, week: int, project_type: str = "dashboard") -> Dict:
        """Generate the structure for a week's content."""
        
        week_titles = {
            1: "AI-Assisted Development Fundamentals",
            2: "Building the Foundation",
            3: "Core Functionality",
            4: "External Integrations",
            5: "Advanced Features",
            6: "Data Management",
            7: "Polish and Optimization",
            8: "Deployment and Launch"
        }
        
        project_specifics = {
            "dashboard": {
                2: "HTML/CSS Layout and Responsive Design",
                3: "JavaScript and DOM Manipulation",
                4: "API Integration (Weather, News)",
                5: "Data Visualization with Chart.js",
                6: "Local Storage and State Management",
                7: "Performance and Accessibility",
                8: "Testing and Deployment"
            },
            "blog": {
                2: "Blog Layout and Typography",
                3: "Markdown Parsing and Rendering",
                4: "Static Site Generation",
                5: "AI Writing Integration",
                6: "SEO and Metadata",
                7: "Comments and Social Features",
                8: "CMS and Deployment"
            },
            "automation": {
                2: "Node.js and npm Fundamentals",
                3: "Building Discord Bots",
                4: "Web Scraping with Puppeteer",
                5: "Task Automation",
                6: "Database Integration",
                7: "Advanced Bot Features",
                8: "Deployment and Monitoring"
            }
        }
        
        week_data = {
            "week": week,
            "title": project_specifics.get(project_type, {}).get(week, week_titles.get(week, f"Week {week}")),
            "description": f"Week {week} content for {project_type} project path",
            "modules": []
        }
        
        # Generate 5 modules per week
        for module_num in range(1, 6):
            module = self.generate_module(week, module_num, project_type)
            week_data["modules"].append(module)
        
        week_data["week_summary"] = {
            "total_xp": sum(m["xp"] for m in week_data["modules"]),
            "skills_developed": list(set(skill for m in week_data["modules"] for skill in m["skills"])),
            "projects_completed": 1 if module_num == 5 else 0,
            "estimated_time": f"{6 + week}-{8 + week} hours",
            "achievement_available": f"Week {week} Warrior"
        }
        
        return week_data
    
    def generate_module(self, week: int, module: int, project_type: str) -> Dict:
        """Generate a single module structure."""
        
        # Module topics based on week and project type
        module_topics = {
            "dashboard": [
                "Setup and Planning", "Core Structure", "Styling", "Interactivity", "Weekly Project"
            ],
            "blog": [
                "Content Structure", "Design System", "Content Processing", "Features", "Weekly Build"
            ],
            "automation": [
                "Environment Setup", "Core Concepts", "Implementation", "Testing", "Weekly Integration"
            ]
        }
        
        skills_map = {
            1: ["ai_prompting", "git"],
            2: ["html", "css"],
            3: ["javascript"],
            4: ["apis", "javascript"],
            5: ["databases", "javascript"],
            6: ["debugging", "optimization"],
            7: ["testing", "accessibility"],
            8: ["deployment", "monitoring"]
        }
        
        topics = module_topics.get(project_type, module_topics["dashboard"])
        topic = topics[module - 1] if module <= len(topics) else f"Module {module}"
        
        return {
            "id": f"w{week}m{module}",
            "number": module,
            "title": f"{topic}",
            "duration": f"{30 + (module * 15)} minutes",
            "difficulty": "beginner" if week <= 2 else "intermediate" if week <= 5 else "advanced",
            "xp": 100 + (week * 10),
            "skills": skills_map.get(week, ["general"]),
            "objectives": [
                f"Learn {topic.lower()} concepts",
                f"Apply AI assistance for {topic.lower()}",
                "Practice with hands-on exercises",
                "Build toward weekly project"
            ],
            "content": self.generate_module_content(week, module, topic, project_type)
        }
    
    def generate_module_content(self, week: int, module: int, topic: str, project_type: str) -> Dict:
        """Generate the actual content for a module."""
        
        return {
            "introduction": f"Welcome to Week {week}, Module {module}: {topic}. "
                          f"In this module, we'll explore key concepts and build practical skills.",
            "video": None,  # Placeholder for future video content
            "reading": {
                "title": f"Understanding {topic}",
                "sections": [
                    {
                        "heading": "Core Concepts",
                        "content": f"Essential concepts for {topic} in {project_type} development..."
                    },
                    {
                        "heading": "Best Practices",
                        "content": f"Industry best practices for implementing {topic}..."
                    },
                    {
                        "heading": "Common Pitfalls",
                        "content": f"Avoid these common mistakes when working with {topic}..."
                    }
                ]
            },
            "exercises": self.generate_exercises(week, module, topic),
            "project": self.generate_project(week, module, topic, project_type)
        }
    
    def generate_exercises(self, week: int, module: int, topic: str) -> List[Dict]:
        """Generate exercises for a module."""
        
        exercises = []
        
        # Generate 2-3 exercises per module
        num_exercises = 2 if module < 5 else 3
        
        for i in range(1, num_exercises + 1):
            exercise = {
                "title": f"{topic} Exercise {i}",
                "description": f"Practice {topic.lower()} concepts with this hands-on exercise",
                "hints": [
                    f"Start by understanding the requirements",
                    f"Use AI assistance to generate initial code",
                    f"Test and refine your solution"
                ],
                "solution": f"// Solution for {topic} Exercise {i}",
                "xp": 25 + (week * 5)
            }
            exercises.append(exercise)
        
        return exercises
    
    def generate_project(self, week: int, module: int, topic: str, project_type: str) -> Dict:
        """Generate project requirements for a module."""
        
        if module < 5:
            # Regular module project
            return {
                "title": f"{topic} Implementation",
                "description": f"Apply what you've learned about {topic} to your {project_type} project",
                "requirements": [
                    f"Implement {topic.lower()} functionality",
                    "Follow best practices",
                    "Test your implementation",
                    "Document your code"
                ],
                "starter_prompts": [
                    f"Help me implement {topic.lower()}",
                    f"Review my {topic.lower()} code",
                    f"Suggest improvements for {topic.lower()}"
                ],
                "xp": 50 + (week * 10)
            }
        else:
            # Weekly culmination project
            return {
                "title": f"Week {week} Integration Project",
                "description": f"Combine everything from Week {week} into a cohesive feature",
                "requirements": [
                    "Integrate all week's modules",
                    "Ensure code quality",
                    "Add polish and refinements",
                    "Prepare for next week"
                ],
                "starter_prompts": [
                    f"Help me integrate Week {week} features",
                    "Review my weekly project",
                    "Suggest final improvements"
                ],
                "xp": 150 + (week * 20)
            }
    
    def save_week_content(self, week: int, content: Dict, project_type: str = "dashboard"):
        """Save generated week content to file."""
        
        week_dir = self.content_dir / f"week{week}"
        week_dir.mkdir(parents=True, exist_ok=True)
        
        # Save as JSON
        json_path = week_dir / f"modules_{project_type}.json"
        with open(json_path, 'w') as f:
            json.dump(content, f, indent=2)
        
        # Also save as YAML for easier editing
        yaml_path = week_dir / f"modules_{project_type}.yaml"
        with open(yaml_path, 'w') as f:
            yaml.dump(content, f, default_flow_style=False)
        
        return json_path, yaml_path
    
    def generate_all_weeks(self, project_type: str = "dashboard"):
        """Generate content for all 8 weeks."""
        
        generated_files = []
        
        for week in range(1, 9):
            click.echo(f"Generating Week {week} content for {project_type}...")
            content = self.generate_week_structure(week, project_type)
            json_path, yaml_path = self.save_week_content(week, content, project_type)
            generated_files.append((json_path, yaml_path))
            click.echo(f"  ✓ Saved to {json_path} and {yaml_path}")
        
        return generated_files
    
    def generate_quiz_questions(self, week: int, module: int, num_questions: int = 5) -> List[Dict]:
        """Generate quiz questions for a module."""
        
        questions = []
        
        question_types = ["multiple_choice", "true_false", "fill_blank", "code_output"]
        
        for i in range(num_questions):
            question = {
                "id": f"w{week}m{module}q{i+1}",
                "type": question_types[i % len(question_types)],
                "difficulty": "easy" if i < 2 else "medium" if i < 4 else "hard",
                "question": f"Question {i+1} for Week {week}, Module {module}",
                "options": ["Option A", "Option B", "Option C", "Option D"] if i % 2 == 0 else None,
                "correct_answer": "Option A" if i % 2 == 0 else "True",
                "explanation": "Explanation of the correct answer...",
                "xp": 10 + (i * 5)
            }
            questions.append(question)
        
        return questions

@click.command()
@click.option('--week', '-w', type=int, help='Generate content for specific week (1-8)')
@click.option('--project', '-p', type=click.Choice(['dashboard', 'blog', 'automation']), 
              default='dashboard', help='Project type')
@click.option('--all-weeks', is_flag=True, help='Generate content for all weeks')
@click.option('--quiz', is_flag=True, help='Generate quiz questions')
@click.option('--output', '-o', help='Output directory')
def main(week, project, all_weeks, quiz, output):
    """Generate course content for Project Hampton."""
    
    generator = ContentGenerator()
    
    if output:
        generator.content_dir = Path(output)
    
    click.echo(f"🚀 Project Hampton Content Generator v{generator.config['project']['version']}")
    
    if all_weeks:
        click.echo(f"\nGenerating all weeks for {project} project...")
        files = generator.generate_all_weeks(project)
        click.echo(f"\n✅ Generated {len(files)} week files!")
    elif week:
        click.echo(f"\nGenerating Week {week} content for {project} project...")
        content = generator.generate_week_structure(week, project)
        json_path, yaml_path = generator.save_week_content(week, content, project)
        click.echo(f"✅ Saved to:\n  - {json_path}\n  - {yaml_path}")
        
        if quiz:
            click.echo(f"\nGenerating quiz questions...")
            for module in range(1, 6):
                questions = generator.generate_quiz_questions(week, module)
                quiz_path = generator.content_dir / f"week{week}" / f"quiz_m{module}.json"
                with open(quiz_path, 'w') as f:
                    json.dump(questions, f, indent=2)
                click.echo(f"  ✓ Module {module}: {len(questions)} questions")
    else:
        click.echo("Please specify --week or --all-weeks")
        click.echo("Use --help for more options")

if __name__ == "__main__":
    main()