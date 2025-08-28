# Project Hampton - Helper Scripts Documentation

This directory contains Python scripts for managing, analyzing, and maintaining Project Hampton.

## Prerequisites

Install required Python packages:
```bash
pip install -r requirements.txt
```

## Available Scripts

### 1. `content_generator.py`
**Purpose**: Generate course content templates and structure
**Usage**: `python scripts/content_generator.py --week 2`
**Features**:
- Creates week module templates
- Generates exercise scaffolding
- Produces quiz questions
- Creates project templates

### 2. `progress_analyzer.py`
**Purpose**: Analyze user progress data and generate insights
**Usage**: `python scripts/progress_analyzer.py --export-format json`
**Features**:
- Parse progress codes
- Generate usage statistics
- Create progress reports
- Export data in multiple formats

### 3. `achievement_manager.py`
**Purpose**: Manage and validate achievements and badges
**Usage**: `python scripts/achievement_manager.py --check-consistency`
**Features**:
- Validate achievement definitions
- Generate achievement icons
- Create achievement documentation
- Check for missing achievements

### 4. `content_validator.py`
**Purpose**: Validate all course content for completeness and correctness
**Usage**: `python scripts/content_validator.py --week all`
**Features**:
- Check for broken links
- Validate JSON structure
- Ensure all modules have required fields
- Check code examples for syntax errors

### 5. `backup_manager.py`
**Purpose**: Create and manage backups of user data and content
**Usage**: `python scripts/backup_manager.py --create --compress`
**Features**:
- Automated backups
- Compression support
- Backup rotation
- Restore functionality

### 6. `test_generator.py`
**Purpose**: Generate test cases and quizzes for modules
**Usage**: `python scripts/test_generator.py --week 1 --difficulty medium`
**Features**:
- Create multiple choice questions
- Generate coding challenges
- Produce fill-in-the-blank exercises
- Export to various formats

### 7. `metrics_collector.py`
**Purpose**: Collect and analyze learning metrics
**Usage**: `python scripts/metrics_collector.py --report weekly`
**Features**:
- Track completion rates
- Measure time spent per module
- Identify challenging content
- Generate improvement suggestions

### 8. `deploy_helper.py`
**Purpose**: Assist with deployment to various platforms
**Usage**: `python scripts/deploy_helper.py --platform github-pages`
**Features**:
- Build optimization
- Asset minification
- Deploy to GitHub Pages
- Generate deployment reports

### 9. `ai_prompt_tester.py`
**Purpose**: Test and validate AI prompts used in the course
**Usage**: `python scripts/ai_prompt_tester.py --module w1m2`
**Features**:
- Test prompt effectiveness
- Generate prompt variations
- Measure prompt complexity
- Suggest improvements

### 10. `documentation_builder.py`
**Purpose**: Build comprehensive documentation from course content
**Usage**: `python scripts/documentation_builder.py --format markdown`
**Features**:
- Generate course catalog
- Create skill trees documentation
- Build achievement guides
- Export to PDF/HTML/Markdown

## Configuration

All scripts use the `config.yaml` file for configuration. Key settings:

```yaml
project:
  name: "Project Hampton"
  version: "0.0.2"
  
paths:
  content: "../content"
  data: "../data"
  exports: "../data/exports"
  backups: "../data/backups"
  
analytics:
  track_anonymous: true
  export_format: "json"
  
deployment:
  platforms: ["github-pages", "netlify"]
  optimize_assets: true
```

## Running Scripts

### Individual Execution
```bash
python scripts/[script_name].py [options]
```

### Batch Operations
```bash
python scripts/run_all.py --daily
```

### Scheduled Tasks
Use the `scheduler.py` script to run tasks on a schedule:
```bash
python scripts/scheduler.py --config daily_tasks.yaml
```

## Output Files

Scripts generate output in the following directories:
- `/data/analytics/` - Analytics reports and metrics
- `/data/exports/` - Exported data in various formats
- `/data/backups/` - Backup files
- `/logs/` - Script execution logs

## Development

To add a new script:
1. Create the script in the `scripts/` directory
2. Add documentation to this README
3. Update `requirements.txt` if new dependencies are needed
4. Add tests in `scripts/tests/`
5. Update the `run_all.py` batch runner if applicable

## Troubleshooting

Common issues and solutions:

### Import Errors
Ensure you're running scripts from the project root:
```bash
cd project_hampton
python scripts/script_name.py
```

### Permission Errors
Some scripts may need write permissions:
```bash
chmod +x scripts/*.py
```

### Missing Dependencies
Install all requirements:
```bash
pip install -r scripts/requirements.txt
```

## Contributing

When adding new scripts:
- Follow PEP 8 style guidelines
- Include comprehensive docstrings
- Add error handling
- Create unit tests
- Update this documentation