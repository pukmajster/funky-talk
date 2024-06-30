import os
import json

# These tell us to which survivor each line belongs to.
playerNames = [
  #l4d1
  "TeenGirl", "NamVet", "Biker", "Manager",
  #l4d2
  "Coach", "Mechanic", "Gambler", "Producer"
]

scriptsPath = "./source-files/"
filesToCheck = [""]
filesToCheck.clear()

# Walk through the scripts folder and get all the files that are present within the "talker" directory
for root, dirs, files in os.walk(scriptsPath):
  for file in files:
    if file.endswith(".txt"):
      if "talker" in root:
        fullPath = os.path.join(root, file)
        filesToCheck.append(fullPath)

for file in filesToCheck: 

  criterions = []
  responses = []
  rules = []
  includes = []

  # Open the file and read all the lines.
  try:
    f = open(file, "r")
    lines = f.readlines()
    print("Reading file: " + file)
    f.close()
  except:
    print("Error reading file: " + file)
    continue

  i = 0

  while i < len(lines):
    line = lines[i].replace("\n", "")
    i += 1
    
    # ----------------------------------------------
    # Skip empty lines
    # ----------------------------------------------
    if(len(line) == 0):
      continue

    # Split line into tokens separated by spaces
    split = line.split(" ")
    
    # Remove all quotes from each token
    for j in range(len(split)):
      split[j] = split[j].replace("\"", "")

    # ----------------------------------------------
    # Skip comments 
    # ----------------------------------------------
    if(split[0] == "//"):
      continue

    blockType = split[0].lower()

    # ----------------------------------------------
    # Criterion block
    # ----------------------------------------------

    if blockType == "criterion":
      print("Criterion block: " + line)

      if(len(split) < 4):
        print("Error: Criterion block does not have enough arguments")
        continue

      criterionName = split[1]
      criterionMatchKey = split[2]
      criterionMatchValue = split[3]
      criterionWeight = 0
      criterionRequired = False

      if len(split) > 4:
        j = 4
        while j < len(split):
          if split[j] == "weight":
            criterionWeight = split[j+1]
            j += 2
          elif split[j] == "required":
            criterionRequired = True
            j += 1
          else:
            break

      criterions.append({
        "name": criterionName,
        "matchKey": criterionMatchKey,
        "matchValue": criterionMatchValue,
        "weight": criterionWeight,
        "required": criterionRequired
      })
      continue
    
  

  # Write file to disk
  # I used to write all the data into one file and that worked great until the gigabytes took our land.
  fPath = file.replace("source-files", "transformed-files") 
  fPath = fPath.split("/")
  fileName = fPath.pop()
  fPath = "/".join(fPath) + "/"

  if not os.path.exists(fPath):
    os.makedirs(fPath)

  textFileName = fPath + fileName  
  jsonFileName = fPath + fileName.replace(".txt", ".json")

  results = {
    "criterions": criterions,
    "responses": responses,
    "rules": rules,
    "includes": includes
  }

  json_data = json.dumps(results, indent=2)
  with open(jsonFileName, 'w+') as outfile:
    outfile.write(json_data)
    outfile.close()

              
