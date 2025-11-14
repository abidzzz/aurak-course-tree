import os
import re

# Dictionary of replacements
replacements = {
    "AURAK Architecture Study Plan": "Bachelor of Architecture Study Plan",
    "AURAK Biotechnology Study Plan": "Bachelor of Science in Biotechnology Study Plan",
    "AURAK Mass Communication Study Plan": "Bachelor of Arts in Mass Communication Study Plan",
    "AURAK Psychology Study Plan": "Bachelor of Science in Psychology Study Plan",
    "AURAK Business Administration Study Plan": "Bachelor of Science in Business Administration Study Plan",
    "AURAK Artificial Intelligence Study Plan": "Bachelor of Science in Artificial Intelligence Study Plan",
    "AURAK Chemical Engineering Study Plan": "Bachelor of Science in Chemical Engineering Study Plan",
    "AURAK Civil Engineering Study Plan": "Bachelor of Science in Civil Engineering Study Plan",
    "AURAK Computer Engineering Study Plan": "Bachelor of Science in Computer Engineering Study Plan",
    "AURAK Computer Science Study Plan": "Bachelor of Science in Computer Science Study Plan",
    "AURAK Electrical and Electronics Engineering Study Plan": "Bachelor of Science in Electrical and Electronics Engineering Study Plan",
    "AURAK Mechanical Engineering Study Plan": "Bachelor of Science in Mechanical Engineering Study Plan",
}

# Function to replace text in an HTML file
def replace_in_html(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # Replace the content in <title> tags
    for old, new in replacements.items():
        content = re.sub(r'<title>(.*?)</title>', lambda m: m.group(0).replace(old, new), content)
        
    # Replace the content in <h1 class="titl"> tags
    for old, new in replacements.items():
        content = re.sub(r'(<h1 class="titl">)(.*?)(</h1>)', lambda m: m.group(1) + m.group(2).replace(old, new) + m.group(3), content)

    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(content)

# Loop through all files in the current directory
def replace_in_all_html_files():
    # Get all files in the current directory
    for filename in os.listdir('.'):
        # Check if the file is an HTML file
        if filename.endswith('.html'):
            print(f'Replacing content in {filename}...')
            replace_in_html(filename)

if __name__ == "__main__":
    replace_in_all_html_files()
