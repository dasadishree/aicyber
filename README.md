# Website/tool that will read metadata of image, and use AI to tell whether it's an AI-generated image or not!
Things in particular to look at:
- file_name 
- claim__generator__info_name (ex: Google C2PA Core Generator Library, ChatGPT)
- actions_software_agent_name (ex: GPT-4o, )
- actions_digital_source_type (ex: http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia)


explaining metadata:
c2pa.created - image was just created
c2pa.converted - changed format??

limitation: won't work too well if something is simply screenshotted from an AI generator instead of saved directly....
