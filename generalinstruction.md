Mission:
 
Building Pakistan First Data Labeling / Annotation Infrastructure
Bringing URDU and other Regional Languages for AI use
VISION:
To take Pakistan move in the AI Race
by building own LLMs base on own languages and dialects


1: Text (NLP)
Raw corpora: Books, newspapers, social media posts, transcripts (speech → text).
Structured corpora: Tagged sentences with:
syntax (POS tags)
named entities (NER)
sentiment labels
QA pairs
2: Speech / Audio
Transcribed speech datasets across:
dialects (urban/rural)
accents
formal vs colloquial speech.
3: Multimodal (Vision + Text)
Datasets linking images with Urdu or local captions.
Useful for avatars, accessibility tools, education tech.
Currently Available Local Sources to Start With (Practically)

Text:
Pakistani news sites (e.g., Jang, Express)
Public social media (Twitter Urdu/Roman Urdu)
Government transcripts (parliament records)

Audio:
Public radio streams
TV archives
Community voice collections

Vision:
Local image libraries with manual captions from volunteers
 
codeXfadi — 9:57 pm
1: Scrapping pipeline setup
Scrap data from Difference sources like news, articles, blogs, twitter, facebook etc
2: Cleanning and Normalizing pipeline setup
Properly clean the scrap data (removing header, footer and other stuff like links etc)

echo "# redbirdzlab" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/hassankhan2510/redbirdzlab.git
git push -u origin main