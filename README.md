# Website/tool that will read metadata of image, and use AI to tell whether it's an AI-generated image or not!
https://drive.google.com/file/d/1mMAZHyihMiYda5tZDngRG-_8DC2Nr1Hc/view?usp=sharing


Things in particular to look at:
- file_name 
- claim__generator__info_name (ex: Google C2PA Core Generator Library, ChatGPT)
- actions_software_agent_name (ex: GPT-4o, )
- actions_digital_source_type (ex: http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia)
<img width="1470" height="956" alt="Screenshot 2026-02-19 at 12 03 23 AM" src="https://github.com/user-attachments/assets/21e7b7a9-0270-46df-9ab0-61c401240290" />


explaining metadata:
c2pa.created - image was just created
c2pa.converted - changed format??

limitation: won't work too well if something is simply screenshotted from an AI generator instead of saved directly....