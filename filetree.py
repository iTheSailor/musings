import os

def generate_file_tree(startpath, output_file):
    with open(output_file, 'w') as f:
        for root, dirs, files in os.walk(startpath):
            level = root.replace(startpath, '').count(os.sep)
            indent = ' ' * 4 * level
            f.write('{}{}/\n'.format(indent, os.path.basename(root)))
            subindent = ' ' * 4 * (level + 1)
            for filename in files:
                f.write('{}{}\n'.format(subindent, filename))

if __name__ == "__main__":
    startpath = input("Enter the directory path: ")
    output_file = input("Enter the output file name (with .txt extension): ")
    generate_file_tree(startpath, output_file)
    print(f"File tree of {startpath} has been written to {output_file}")
