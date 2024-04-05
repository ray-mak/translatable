import json

with open("languages_data.json", "r") as json_file:
    languages = json.load(json_file)

language = [{"code": lang["code"], "name": lang["name"]} for lang in languages]

with open("language_codes.json", "w") as output_file: 
    json.dump(language, output_file, indent=4)

print("Data extracted")