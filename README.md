# TestDESDR_API

This is a testbed of code for APIs with noki, the desdr sliders, etc

# Emails that this code is based on (with my test comments/commands):

# Noki
On Dec 11, 2025, at 8:00 AM, Lilita Getnet Yenew <lgy2104@columbia.edu> wrote:

Hi Dan,
Hope you're doing well! Yes, we do have API endpoints in noki.py that can return a CSV. To use it, you’ll first generate an access token using your account. In a terminal, you would run:

curl -X POST https://<NOKI-SERVER-URL>/token \
     -H "Content-Type: application/json" \
     -d '{"username":"<your-username>","password":"<your-password>"}'

This will return a JSON response containing a "token" value. Copy that token and use it in the next command:

curl -H "Authorization: Bearer <your-token>" \
     -o <your-file-name>.csv \
     "https://<NOKI-SERVER-URL>/download_csv?deployment_name=NOKI"

That will save the file in your current folder. I haven't used this endpoint to extract CSVs myself yet, but based on the backend code, this is how it’s designed to work. If anything doesn’t behave as expected, or if you have any questions, I’d be happy to troubleshoot. Thank you!


Temporary Noki user guide
https://docs.google.com/document/d/1swTwjRUFirfAnfZnKdVtn9BTy0joJcw3vid-emhUeY4/edit?pli=1&tab=t.0

## Downloading data from Sliders:
On Dec 10, 2025, at 4:37 PM, Kenny Frias <kf2792@columbia.edu> wrote:

Hey Dan!

Thanks for the email. I apologize that my guide wasn't clear enough---I'll touch it up more to make it clearer!

So I went to check on convex, and I do indeed see your user, "do2126@columbia.edu" within Ethiopia_data and Ethiopia_state. The issue with your current approach is that you aren't running the file within the slider directory. To run it as a standalone file, you'd need a package.lock set up in your folder with the necessary things downloaded. It's easiest to run it inside the standard-template branch. So here are some steps: 
Follow this guide to install sliders locally on your machine (if you don't already have it up and running on your laptop) 
git checkout standard-template to switch to the standard template branch. If you have made changes in your current branch, you have to first run git stash to stash your changes and prevent conflicts. 
Then, inside getCSV, replace "Bangladesh_data" and "Bangladesh_state" with Ethiopia, and then:
 run node getCSV.js do2126@columbia.edu

