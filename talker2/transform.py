import os
import json

filesToCheck =[ "talker2/merged.txt"]
print("Starting transform.py")

def remove_values_from_list(the_list, val):
   return [value for value in the_list if value != val]

def removeQuotesFromList(list):
  for i in range(len(list)):
    list[i] = list[i].replace("\"", "")
  return list

def lineToUnquotedList(line):
  split = remove_values_from_list(line.split(" "), '')
  
  return removeQuotesFromList(split)

# --------------------------------------------------------------
# Parses a single criterion line
# --------------------------------------------------------------
def parseCriterion(line):
  split = lineToUnquotedList(line)

  print("------ Parsing Criterion ------------")
  print("Parsing criterion: " + line)
  print("Split: " + str(split))

  if(len(split) < 4):
    print("Error: Criterion block does not have enough arguments")
    return;

  parsedCriterion = {
    "name": split[1],
    "matchKey": split[2],
    "matchValue": split[3],
    "weight": 0,
    "required": False
  }

  if len(split) > 4:
    j = 4
    while j < len(split):
      if split[j] == "weight":
        parsedCriterion["weight"] = int(split[j+1])
        j += 2
      elif split[j] == "required":
        parsedCriterion["required"] = True
        j += 1
      else:
        break
  
  return parsedCriterion

# --------------------------------------------------------------
# Parses a single response block
# --------------------------------------------------------------
def parseResponseBlock(lines):

  parsedResponse = {
    "name": "",
    "scenes": []
  }

  for i in range(len(lines)):
    line = lines[i]
    split = lineToUnquotedList(line)

    if(len(split) < 1):
      continue;

    # Get the name of the response
    if i == 0:
      parsedResponse["name"] = split[1]

    # Skip block opener "{""
    elif i == 1:
      if split[0] != "{":
        print("Empty response block")
        break;
      continue

    # Skip block closer "}"
    elif i == len(lines) - 1:
      continue

    # Sequental parameter
    elif split[0] == "sequential":
      parsedResponse["sequential"] = True
      continue

    # Norepeat parameter
    elif split[0] == "norepeat":
      parsedResponse["norepeat"] = True
      continue
   
    # Parse the scene
    else:
      scene = parseScene(line)
      parsedResponse["scenes"].append(scene)

  print(parsedResponse)
    
  return parsedResponse
  
# --------------------------------------------------------------
# Parses a single scene
# --------------------------------------------------------------
def parseScene(line):
  split = lineToUnquotedList(line)

  print("Parsing scene: " + line)

  print("Split: " + str(split))

  if split[0] != "scene":
    print("Error: Scene block does not start with 'scene'")
    return
  
  if len(split) < 2:
    print("Error: Scene block does not have enough arguments")
    return

  parsedScene = {
    "scene": split[1],
  }

  i = 2
  while i < len(split):
    token = split[i]

    print("Parsing token: " + token)

    # Parse followup concept
    if token == "then":
      print("Parsing followup concept")
      parsedScene["then"] = {
        "target": split[i+1],
        "concept": split[i+2],
        "responseContext":  split[i+3],
        "delay": split[i+4]
      }
      i += 5

    # Parse subtitle for this scene
    elif token.startswith("//"):
      print("Parsing subtitle")
      subtitle = line.split("//")[1]
      parsedScene["subtitle"] = subtitle
      break
  
    else:
      print("Error: Unrecognized token in scene block: " + token)
      i += 1

  return parsedScene

# --------------------------------------------------------------
# Parses a single rule block
# --------------------------------------------------------------
def parseRuleBlock(lines):
  parsedRule = {
    "name": "",
  }

  for i in range(len(lines)):
    line = lines[i]
    split = lineToUnquotedList(line)

    # Get the name of the response
    if i == 0:
      print("Parsing rule block: " + line)
      parsedRule["name"] = split[1]
      continue

    # Skip block opener "{""
    elif i == 1:
      continue

    # Skip block closer "}"
    elif i == len(lines) - 1:
      continue
   
    # Parse the scene
    else:
      initialToken = split[0].lower()

      if initialToken == "criteria":
        parsedRule["criteria"] = line.split(" ")[1:]
      elif initialToken == "response":
        parsedRule["response"] = split[1]
      elif initialToken == "applycontext":
        parsedRule["applyContext"] = split[1]
      elif initialToken == "applycontexttoworld":
        parsedRule["applyContextToWorld"] = True
        
  return parsedRule

for file in filesToCheck: 

  criterions = {}
  responses = {}
  rules = {}
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
      split[j] = split[j]

    # ----------------------------------------------
    # Skip comments 
    # ----------------------------------------------
    if(line.startswith("//")):
      continue

    blockType = split[0].lower()
    print("------ Block Type ----------------")
    print("Block type: " + blockType)

    # ----------------------------------------------
    # Criterion line
    # ----------------------------------------------

    if blockType == "criterion":
      criterion = parseCriterion(line.replace("\t", " "))
      criterions[criterion["name"]] = criterion      

    # ----------------------------------------------
    # Blocks (Responses, Rules)
    # ----------------------------------------------

    elif blockType == "response" or blockType == "rule":
      collectedLines = [
        line
      ]

      while i < len(lines):
        collectingLine = lines[i].replace("\n", "", -1)
        collectingLine = collectingLine.replace("\t", "")
        i += 1
       
        collectedLines.append(collectingLine)

        if collectingLine.startswith("}"):
          break

      #print("------ Collected lines --------------")
      #print(str(collectedLines))

      if blockType == "response":
        response = parseResponseBlock(collectedLines)
        responses[response["name"]] = response

      elif blockType == "rule":
        rule = parseRuleBlock(collectedLines)
        rules[rule["name"]] = rule

  print("------ Writing file ----------------")
  jsonFileName = file.replace(".txt", ".json")

  print("Writing file: " + jsonFileName)

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

              
