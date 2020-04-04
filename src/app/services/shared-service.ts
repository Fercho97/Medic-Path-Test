import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';


const SECRET_KEY = 'new_secret';

@Injectable({
    providedIn: 'root',
})
export class CryptoStorage{

    constructor(){
        
    }

    encryptData(data){
        let encrypted = CryptoJS.AES.encrypt(data, SECRET_KEY);

        window.sessionStorage.setItem('session',encrypted);
    }

    decryptData(key){
        let session = sessionStorage.getItem('session');
        if(session!=null){
            let decrypted = CryptoJS.AES.decrypt(session,SECRET_KEY);

            if(decrypted.toString){
            let decryptedSess = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
            return decryptedSess[key].toString();
            }
        }else{
            return null;
        }
    }
}