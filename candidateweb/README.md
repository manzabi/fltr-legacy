# candidateWeb

## Requirements to work and build this project.
We need to use nodejs v8.11.4 and npm v5.6.0

In order to manage the diferent node versions we can use NVM(Node Version Manager) to do that follow the following steps:

1. Install nvm running this command (Only unix terminal)
``` bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```
2. Restart the terminal (Close and open a new terminal)

3. Run command ```nvm``` you should see the nvm command help.

4. Install node version 8 LTS using this command.
```bash
nvm install v8.11.4
```

5. Each session you need to specify the node version you want to use.
```bash
## Specify the complete node version ot just the first number to use the latest version 8 installed
nvm use 8

## Use the defined version on the nvmrc for the project
nvm use
```
