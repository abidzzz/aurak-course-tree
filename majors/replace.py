import os
import re

# Function to replace text in an HTML file
def replace_in_html(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # Replace specific <h1> content by inserting "5-Year Study Plan"
    content = re.sub(
        r'(<h1 class="titl">.*?Study Plan.*?)<br> \((\d{4}-\d{4})\)',  # Match any "Study Plan"
        r'\1 4-Year Study Plan <br> (\2)',  # Insert "5-Year Study Plan" before the year
        content
    )

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
