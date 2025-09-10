# Presences
Saisie de présences et export au format BDNS (Jeunesse+Sport suisse)

## Stack
* Application React + TypeScript + Vite 
* Configuration PWA pour apparaître comme une application mobile 
* The DB is full client side using indexDB/localForage. No server, no encryption.

## Dev setup
1. Clone project
2. Install node 23 or `nvm use` with nvm
3. Install node modules with `npm install`

## Test & Debug
### In a browser
* Run `npm run dev --host` in the terminal
* Browse to `http://localhost:5173`

### On smartphone
* Run `npm run dev -- --host` in the terminal
* Check your IP address on the local wifi
* Allow dev mode on your smartphone (https://developer.android.com/studio/debug/dev-options#enable)
* Connect your smartphone with USB
* On your smartphone, open chrome, load `Your-IP:5174`
* On desktop, open Chrome, load `chrome://inspect/#devices`

This way, you can test your app on phone, while seeing the debugger on desktop.

## Usage guide
* Saisir le nouveau "prénom nom" dans l'auto complete directement pour, en une fois :
  * Ajouter l'élève
  * Créer la présence
* Le premier espace délimite la fin du prénom
  * Exemple: "Prenom nom composé"
  * Editer l'élève par la suite pour ajouter un prénom composé.
* Suivant le browser utilisé, la DB et le backup peuvent être empêchés par sécurité.
  * Passer en mode "coupe-feu"
  * Désactiver la protection contre le tracking pour permettre la sauvegarde indexedDB.
