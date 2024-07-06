# Merge all the files in the directory into one file

import os
import sys

def merge_files(directory, output_file):
    with open(output_file, 'w') as out:
        for file in os.listdir(directory):
            if file.endswith('.txt'):
                with open(os.path.join
                          (directory, file), 'r') as f:
                    out.write('// ------------------------------------------------------------\n')
                    out.write('// ' + file + '\n')
                    out.write('// ------------------------------------------------------------\n\n')
                    out.write(f.read())
                    out.write('\n')

    print("Merged all files in the directory into " + output_file)

merge_files("talker2/merged_folder/talker", "talker2/merged.txt")