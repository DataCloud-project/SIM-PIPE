<script lang="ts">
    let secrets: any[] = [];
    let secret: { [key: string]: string} = {
        name: 'kube-secret',
        username: 'kube-username',
        password: 'kube-password',
        host: 'kube-host',
    };
    let newName = '';
    let newUserName = '';
    let newHostName = '';

    let passwordLength: number = 10;
    
    // write a function that updates the values of the secret object and stores it in a json file
    function updateSecret(newName: string, newUserName: string, newHostName: string) {
        // update the secret object
        secret.name = newName;
        secret.username = newUserName;
        secret.host = newHostName;
        secret.password = generateRandomString(passwordLength);
        // store the secret object in a json file
        console.log(secret)
        // secrets.push(secret)
        // var json = JSON.stringify(secrets);
        // var fs = require('fs');
        // fs.writeFile('@lib/secrets.json', json, 'utf8');
    }

    function generateRandomString(length: number) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

</script>


<!-- Visual part of component -->
<span>Input secret details for new secret</span>
<table>
    <tr>
        <td>
            <input class="input variant-form-material" title="name" type="text" placeholder="name" bind:value={newName}/>
        </td>
        <td>
            <input class="input variant-form-material" title="username" type="text" placeholder="username" bind:value={newUserName}/>
        </td>
        <td>
            <input class="input variant-form-material" title="hostname" type="text" placeholder="hostname" bind:value={newHostName}/>
        </td>
        <td>
            <button type="button" class="btn variant-filled" on:click={() => updateSecret(newName=newName, newUserName=newUserName, newHostName=newHostName)}>
                <span>Submit</span>
            </button>
        </td>
    </tr>
</table>