import { BackendDataService } from 'src/app/core/backend-data.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getDocs } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private router: Router, private firestore: AngularFirestore, private backendDataService: BackendDataService) { }


  // Valifation function to be called by login function
  // Returns the first match for email+password pair in user data array
  private async validateCredentials(email: string, password: string): Promise<boolean> {
    let db = this.firestore.firestore;
    var query = db.collection('users').where('email' , '==', email).where('password' , '==', password);
    const querySnapshot = await getDocs(query);
    let userFound = false;
    querySnapshot.forEach((doc) => {
      if(doc.exists()){
        userFound = true;
      }
    });
    return userFound;
  }


  ///////////////////////
  /// Log-In handling ///
  ///////////////////////

  async login(email: string, password: string) : Promise<boolean>{
    let db = this.firestore.firestore;
    let succssfulLookup = await this.validateCredentials(email, password);      // check credentials with database

    console.log('lookup state', succssfulLookup);         // for debugging
    // TODO: Implement login logic and set role in local storage
    let successfulState = false;

    // On success enter login state in "loggedIn" collection and return docId as token,center email + time
    let data = {
      email,
      timestamp: Date.now()
    }
  
    if(succssfulLookup){
      let token = sessionStorage.getItem('logInToken');
      const tokenDoc = await this.backendDataService.getloggedInData(token);
      if(tokenDoc != null){
        if(!tokenDoc['exists']()){
          let newEntryDoc = await db.collection('loggedIn').add(data);
          sessionStorage.setItem('logInToken', newEntryDoc.id);                 // Add doc ID to session storage to be able to retrieve login state
        }else{
          /*  No verification at this point that email or timestamp is valid
              ToDo: implement checkup
          */
          console.log('Token exists');
        }
        successfulState = true; 
      }else{
        let newEntryDoc = await db.collection('loggedIn').add(data);
        sessionStorage.setItem('logInToken', newEntryDoc.id);                 // Add doc ID to session storage to be able to retrieve login state
        successfulState = true;
      }  
    }
    if(succssfulLookup && successfulState){
      console.log("Successfully logged in")  // for debugging
      this.router.navigate(['/home']);
    }else{
      console.log("Log in failed in auth-service.ts, logIn()")  // for debugging
    }
    return succssfulLookup && successfulState;
  }

  // Function to perfrorm logout and clear session storage
  // Sets login state to false, removes user role
  logout() : boolean{
    this.backendDataService.removeloggedInData(sessionStorage.getItem('logInToken'));
    sessionStorage.removeItem('logInToken');
    return true;
  }

  // Getter for login status, logged in = true
  async isLoggedIn() : Promise<boolean>{
    let token = sessionStorage.getItem('logInToken');
    const tokenDoc = await this.backendDataService.getloggedInData(token);
    if(tokenDoc != null){
      if(tokenDoc['id'] === token){
        return true
      }
    }
    return false;
  }
}

