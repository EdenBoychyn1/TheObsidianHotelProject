// const { get } = require("jquery");

// // IIFE -- Immediatley Invoked Function Expression
(function () {

  /**
  ******************************************************************************************************************************************************************************
  ***********************************************************************************UTILITY FUNCTIONS**************************************************************************
  ******************************************************************************************************************************************************************************
  */

  /**
   * This function takes the fieldID from the input form and tests it against the regular expression to validate that specific field; the designated 
   * error message then populates for the specific field that was entered incorrectly.
   *
   * @param {*} fieldID
   * @param {*} regular_expression
   * @param {*} error_message
   * @return {boolean} 
   */
  function ValidateField(fieldID, regular_expression, error_message) {

    /**
     *  Get the user input value of the fieldID 
     * @type {string} 
     * */
    let fieldValue = document.getElementById(fieldID).value;

    // Create the element and attributes of the error meassage
    let errorMessage = Object.assign(document.createElement('div'), { id: "messageArea", className: "alert alert-danger", textContent: error_message });

    /*
    * Test the regular expression against the fieldValue and if it does not pass the validation against the specific regEx
    * then insert the error message at the specific index of the parent node in this case it is the register form. 
    * Return false if it does not pass validation.
    * If it passes validation, hide the error message and return true. 
    */
    if (!regular_expression.test(fieldValue)) {


      // Return the parent element
      let parentElement = document.getElementById("registerForm");

      // Insert the error message in the parent element at a specific index
      parentElement.insertBefore(errorMessage, parentElement.childNodes[2]);
      return false;
    }
    else {

      // If there are no errors, hide the error div
      errorMessage.style.display = "none";
      return true;
    }
  }


  /**
   * This function determines whether the password and confirm password match. If the confirm password and the password match then an error message will NOT populate.
   * However if the passwords do not match then the error message will populate. 
   *
   * @return {boolean} 
   */
  function PasswordMatch() {

    // Return the value of the password from the form that it is being called from. This would be what the user entered into that field.  
    let password = document.getElementById("password").value;

    //Return the value of the confirm password from the form that it is being called from. This would be what the user entered into that field.  
    let confirmPassword = document.getElementById("confirmPassword").value;

    // Create an error message and the attributes that are associated with that error message
    let errorMessage = Object.assign(document.createElement('div'), { id: "messageArea", className: "alert alert-danger", textContent: "Confirm password entered must match what was entered for the password." });

    // If the password does not match the confirm password then get the form id and use it as a parent div to insert the error message into and return false for password match. 
    // If the password does match the confirm password then hide the error message div and return true for password match 
    if (password !== confirmPassword) {
      // Return the parent element
      let parentElement = document.getElementById("registerForm");

      // Insert the error message in the parent element at a specific index
      parentElement.insertBefore(errorMessage, parentElement.childNodes[2]);
      return false;
    }
    else {
      errorMessage.style.display = "none";
      return true;
    }
  }

  /**
   * Get the register form id and get the class name of the error messages inside the parent element.
   * For all the messages there could be in the form remove each one until there isn't anymore error messages
   */
  function clearAllErrorMessages() {

    // Get the id of the register id
    let parentElement = document.getElementById("registerForm");

    // Get the class name of all elelemnts that have the class attribute set to "alert alert-danger"
    let errorMessages = parentElement.getElementsByClassName("alert alert-danger");

    // loop through each error message and remove each one. 
    Array.from(errorMessages).forEach((errorMessage) => {
      errorMessage.remove();
    });
  }

  /**
   * When the user selects the submit button we will return the values of the form like 
   * first name, last name, email address, and password to initialize a User object.   
   */
  function UserRegistration() {

    // When the user selects the submit button we will return the values of the form like 
    // first name, last name, email address, and password to initialize a User object.     
    document.getElementById("submitButton").addEventListener("click", function (event) {
      // Prevent default so that the form does not reset for testing purposes
      event.preventDefault();

      clearAllErrorMessages();

      let firstNameValid = ValidateField("firstName", /([A-Z][a-z]{1,})$/, "Please enter a valid first name. This must include at least a capitalized first name.");
      let lastNameValid = ValidateField("lastName", /([A-Z][a-z]{1,})$/, "Please enter a valid last name. This must include at least a capitalized last name.");
      let emailAddressValid = ValidateField("emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/, "Please enter a valid email address.");
      let passwordValid = ValidateField("password", /.{12,}$/, "The password must be at least 12 characters in length.")
      let confirmPasswordValid = ValidateField("confirmPassword", /.{12,}$/, "The confirm password must be at least 12 characters in length and must match what was entered in the password field.");
      let passwordMatch = PasswordMatch();


      if (firstNameValid === true && lastNameValid === true && emailAddressValid === true && passwordValid === true && confirmPasswordValid === true && passwordMatch === true) {
        if (document.getElementById("termsAndConditionsCheckbox").checked) {

          let firstName = document.getElementById("firstName").value;
          let lastName = document.getElementById("lastName").value;
          let emailAddress = document.getElementById("emailAddress").value;
          let password = window.btoa(document.getElementById("password").value);
          let security_level;
          let userName = emailAddress;
          let guest;
          // Depending on the title of the html, we will determine if the prospective user that is registering is a prospective guest
          // or being registered as a front desk agent (security roles)
          if (document.title === "Employee Register") {
            security_level = "front_desk_agent";
            user = new core.User(firstName, lastName, userName, emailAddress, security_level, password);
            let key = userName;
            // Store the key in local storage 
            localStorage.setItem(key, user.serialize());

          }
          else {
            security_level = "guest";

            let unitNumber = document.getElementById("inputUnitNumber").value;
            let streetNumber = AddressNumberSplit(document.getElementById("inputAddress").value);
            let streetName = AddressSplit(document.getElementById("inputAddress").value);
            let city = document.getElementById("inputCity").value;
            let province = document.getElementById("inputProvince").value;
            let country = document.getElementById("inputCountry").value;
            let postalCode = document.getElementById("inputPostalCode").value;

            let dateCreated;
            let lastUpdated;

            // Declare and initialize a user object and input the parameters for the constructor  
            guest = new core.Guest(firstName, lastName, userName, emailAddress, security_level, password, unitNumber, streetNumber, streetName, city, province, country, postalCode, dateCreated, lastUpdated);
            console.log(guest.toString());

            // Seralize the user
            if (guest.serialize()) {

              // Let the username which is also the email be the key
              let key = userName;
              // Store the key in local storage 
              localStorage.setItem(key, guest.serialize());
            }
          }

          document.getElementById("registerForm").reset();
        }
      }
      else {
        event.preventDefault();
      }
    });
  }

  /**
   *
   *
   * @param {string} element
   * @param {string} page_name
   */
  function loadMainComponents(element, page_name, index) {


    let XHR = new XMLHttpRequest();

    XHR.addEventListener("readystatechange", function () {

      if (XHR.readyState === 4 && XHR.status === 200) {
        document.getElementsByTagName(element)[index].innerHTML = XHR.responseText;
      }
    });

    XHR.open("GET", `../Server/Components/${page_name}.html`);

    XHR.send();

  }

  /**
 *
 *
 * @param {string} element
 * @param {string} page_name
 */
  function AjaxRequest(page_name, callback) {

    let XHR = new XMLHttpRequest();

    XHR.addEventListener("readystatechange", function () {

      if (XHR.readyState === 4 && XHR.status === 200) {

        if (typeof callback === "function") {
          callback(XHR.responseText)
        }
        else {
          console.log("ERROR: callback is not a function");
        }
      }
    });

    XHR.open("GET", `../Server/Components/${page_name}.html`);

    XHR.send();

  }

  function LoadHeader(html_data) {
    document.getElementsByTagName("header")[0].innerHTML = html_data;

    let typeOfUser = RetrieveKey();
    CheckLogin(typeOfUser);
  }

  function LoadFooter(html_data) {
    document.getElementsByTagName("footer")[0].innerHTML = html_data;

    Copyright();
    let typeOfUser = RetrieveKey();
    // CheckLogin(typeOfUser);
  }

  function RetrieveKey() {
    let keys = Object.keys(sessionStorage);

    for (const key of keys) {

      if (key === "guest") {
        return key;
      }
      else if (key === "front_desk_agent") {
        return key;
      }
    }
  }

  function AddressNumberSplit(address) {
    let split = address.split(" ");
    return split[0];
  }


  /**
   *
   *
   * @param {string} address
   * @return {string} 
   */
  function AddressSplit(address) {
    let split = address.split(" ");
    let number = split[0];
    let name = split[1];
    for (let i = 2; i < split.length; i++) {
      name += " " + split[i];
    }
    return name;
  }

  /**
   * Retrieves the guest user details when the guest has logged in. Asks the user igfhtey are making the reservation for themselves and if they are then
   *
   */
  function RetrieveGuestDetails() {
    document.getElementById("gridCheck").addEventListener("click", () => {

      let userGuest = document.getElementById("gridCheck");
      if (userGuest.checked) {

        let keys = Object.keys(localStorage);
        // for every user in the users.json file
        for (const key of keys) {

          let guest_data = localStorage.getItem(key);
          let newGuest = new core.Guest();
          newGuest.deserialize(guest_data);

          if (newGuest.SecurityLevel === "guest") {
            document.getElementById("inputReservationFirstName").value = newGuest.FirstName;
            document.getElementById("inputReservationLastName").value = newGuest.LastName;
            document.getElementById("inputAddress").value = `${newGuest.StreetNumber} ${newGuest.StreetName}`;
            document.getElementById("inputUnitNumber").value = newGuest.UnitNumber;
            document.getElementById("inputCity").value = newGuest.City;
            document.getElementById("inputProvince").value = newGuest.Province;
            document.getElementById("inputCountry").value = newGuest.Country;
            document.getElementById("inputPostalCode").value = newGuest.PostalCode;
          }
        }
      }
      else if (!userGuest.checked) {
        document.getElementById("inputReservationFirstName") = "";
        document.getElementById("inputReservationLastName") = "";
      }

    });
  }

  function RoomAssignment(reservation_start_date, reservation_end_date, room_type) {

  }

  /**
   * Retrieve the room type that is acceptable for Room class so that this room type can be stored in the reservation and room object.
   *
   * @param {string} room_type
   * @return {string} 
   */
  function RoomType(room_type) {
    let roomType = "";
    switch (room_type) {
      case "Twin Room with Beach View":
        return roomType = "TWN ROOM";
      case "Double Room with Beach View":
        return roomType = "DBL ROOM";
      case "Queen Room with Balcony & Beach View":
        return roomType = "QUEEN ROOM";
      case "King Ensuite with Balcony & Beach View":
        return roomType = "KING ROOM";
    }
  }

  function CheckLogin(type_of_user) {

    if (sessionStorage.getItem(type_of_user)) {
      let logoutText = document.getElementsByClassName("nav-item")[5];

      logoutText.innerHTML = `<a id="logout" class="nav-link" href="#">Logout</a>`;

      document.getElementById("logout").addEventListener("click", function () {
        sessionStorage.removeItem(type_of_user);

        location.href = "login.html"
      });
    }
  }

  function Copyright() {
    document.getElementById("copyrightDate").appendChild(document.createTextNode(new Date().getFullYear()))
  }
  /**
  ******************************************************************************************************************************************************************************
  ***********************************************************************************PAGE CALLS*********************************************************************************
  ******************************************************************************************************************************************************************************
  */

  /**
  * Get the home page
  * For testing purposes call console log home page
  */
  function DisplayHomePage() {
    console.log("Home Page");
  }

  function DisplayRoomsPage() {
    console.log("Rooms Page");
  }

  /**
   * Get the reservation page
   * For testing purposes call console log reservation page
   */
  function DisplayReservationPage() {

    console.log("Reservations Page");

    RetrieveGuestDetails();

    document.getElementsByClassName("btn btn-primary")[0].addEventListener("click", function () {
      let guestFirstName = document.getElementById("inputReservationFirstName").value;
      let guestLastName = document.getElementById("inputReservationLastName").value;
      let unitNumber = document.getElementById("inputUnitNumber").value;
      let streetNumber = AddressNumberSplit(document.getElementById("inputAddress").value);
      let streetName = AddressSplit(document.getElementById("inputAddress").value);
      let city = document.getElementById("inputCity").value;
      let province = document.getElementById("inputProvince").value;
      let country = document.getElementById("inputCountry").value;
      let postalCode = document.getElementById("inputPostalCode").value;
      let checkInDate = document.getElementById("inputCheckInDate").value;
      let checkOutDate = document.getElementById("inputCheckOutDate").value;
      let numberofPeople = document.getElementById("inputPax").value;
      let roomType = document.getElementById("inputRoomType").value;
      let dateCreated;
      let lastUpdated;
      let roomNumber = 1;

      // Let the username which is also the email be the key
      let key = guestLastName + Date.now();

      let newReservation = new core.Reservation(key, checkInDate, checkOutDate, numberofPeople, roomNumber, unitNumber, streetNumber, streetName, city, province, country, postalCode, dateCreated, lastUpdated);

      if (newReservation.serialize()) {

        // Store the key in local storage 
        localStorage.setItem(key, newReservation.serialize());
      }

      console.log(`New Reservation: ${newReservation.toString()
        } `)
    });

  }

  function DisplayGalleryPage() {
    console.log("Gallery Page");

    console.log(document.querySelectorAll("li")[5]);
  }

  /**
  * Get the about page
  * For testing purposes call console log about page
  */
  function DisplayAboutPage() {
    console.log("About Us Page");

    loadMainComponents("div", "picture-div", 2);
  }

  /**
   * Get the login page
   * For testing purposes call console log login page
   * When the user submits the form by selecting the "loginButton", it is assumed that the user did not enter the correct login credentials to access the website.
   * Store the keys in localStorage into the keys variable and for every key in the keys array get the data based on the key provided and createb a new User object
   * Break apart the user data and if the username entered is the same as the username as the object's username retrieved by the key and if the password entered is
   * the same as password retrieved by the key then the user has been authenticated. If not, an error message will be displayed. "break" is used to break out of the 
   * for loop when the user has or has not been found in localStorage. 
   */
  function DisplayLoginPage() {
    console.log("Login Page");

    // Get the error message 
    let errorMessage = document.getElementById("messageArea");

    // Hide the error message because when the page loads there should not be any errors if the user has not entered anything
    errorMessage.style.display = "none";

    document.getElementById("loginButton").addEventListener("click", function (event) {

      let loginSuccess = false;

      let keys = Object.keys(localStorage);

      console.log(keys);

      // for every user in the users.json file
      for (const key of keys) {

        let user_data = localStorage.getItem(key);
        let newUser = new core.User();
        let newGuest = new core.Guest();
        newUser.deserialize(user_data);
        let encryptedPassword = window.btoa(password.value);
        if (newUser.SecurityLevel === "guest") {

          if (userName.value === newUser.UserName && encryptedPassword === newUser.Password) {
            // get the user data from the file and assign to our empty user object
            // newUser.fromJSON(key);
            loginSuccess = true;

            // if username and password matches - success.. the perform the login sequence
            if (loginSuccess) {

              newGuest.deserialize(user_data);

              // add user to session storage
              sessionStorage.setItem("guest", newGuest.serialize());

              // hide any error message
              errorMessage.style.display = "none";

              // redirect the user to the secure area of our site - contact-list.html
              location.href = "about.html";
            }
            // else if bad credentials were entered...
            else {
              // display an error message
              $("#username").trigger("focus").trigger("select");
              errorMessage.addClass("alert alert-danger").text("Error: Invalid Login Information").show();
            }
            break;
          }
        }
        else {

          // check if the username and password entered in the form matches this user
          if (userName.value === newUser.UserName && encryptedPassword === newUser.Password) {
            // get the user data from the file and assign to our empty user object
            // newUser.fromJSON(key);
            loginSuccess = true;

            // if username and password matches - success.. the perform the login sequence
            if (loginSuccess) {
              // add user to session storage
              sessionStorage.setItem("front_desk_agent", newUser.serialize());

              // hide any error message
              errorMessage.style.display = "none";

              // redirect the user to the secure area of our site - contact-list.html
              location.href = "about.html";
            }
            // else if bad credentials were entered...
            else {
              // display an error message
              $("#username").trigger("focus").trigger("select");
              errorMessage.addClass("alert alert-danger").text("Error: Invalid Login Information").show();
            }
            break;
          }
        }
      }
    });
  };

  /**
   * Get the registration page
   * For testing purposes call console log registration page
   * Invoke the registration method when the form is submitted. 
   */
  function DisplayRegisterPage() {

    console.log("Register Page");

    // Invoke the UserRegistration() method
    UserRegistration();
  }

  /**
   * Get the employee registration page
   * For testing purposes call console log employee registration page
   * Invoke the employee registration method when the form is submitted. 
   */
  function DisplayEmployeeRegisterPage() {
    console.log("Employee Register Page");

    // Invoke the UserRegistration() method
    UserRegistration();
  }

  function DisplayReservationListPage() {
    console.log("Reservation List Page");

    if (localStorage.length > 0) {
      let reservationList = document.getElementById("reservationList");

      // Insert data from localstorage
      let data = "";

      // Returns an array of keys
      let keys = Object.keys(localStorage);

      // Counts the keys
      let index = 1;

      for (const key of keys) {
        let reservationData = localStorage.getItem(key);

        let newReservation = new core.Reservation();

        newReservation.deserialize(reservationData);

        // Inject a repeatable row into the contactlist
        data += `<tr>
        <th scope="row" class="text-center">${index}</th>
        <td>${key}</td>
        <td>${newReservation.CheckInDate}</td>
        <td>${newReservation.CheckOutDate}</td>
        <td>${newReservation.NumberOfGuests}</td>
        <td class="text-center"><button value="${key}" class="btn btn-primary btn-sm edit"><i class="fas fa-edit fa-sm"></i> Update Reservation</button></td>
        <td class="text-center"><button value="${key}" class="btn btn-danger btn-sm delete"><i class="fas fa-trash-alt fa-sm"></i> Delete Reservation</button></td>
        </tr> `;

        index++
      }


      reservationList.innerHTML = data;

      document.querySelector(".delete").addEventListener("click", function () {
        if (confirm("Are you sure?")) {
          localStorage.removeItem(this.value);
        }
        location.href = "reservation-list.html";
      });

      document.querySelector(".edit").addEventListener("click", function () {
        location.href = "reservation-edit.html#" + this.value;
      });
    }

  }

  function DisplayReservationEditPage() {
    console.log("Reservation Edit Page");

    let substring = location.hash.substring(1);

    let editReservation = new core.Reservation();

    editReservation.deserialize(localStorage.getItem(substring));

    document.getElementById("inputReservationFirstName").value = editReservation.FirstName;
    document.getElementById("inputReservationLastName").value = editReservation.LastName;
    document.getElementById("inputAddress").value = `${editReservation.BillingStreetNumber} ${editReservation.BillingStreetName} `;
    document.getElementById("inputUnitNumber").value = editReservation.BillingUnitNumber;
    document.getElementById("inputCity").value = editReservation.BillingCity;
    document.getElementById("inputProvince").value = editReservation.BillingProvince;
    document.getElementById("inputCountry").value = editReservation.BillingCountry;
    document.getElementById("inputPostalCode").value = editReservation.BillingPostalCode;
    document.getElementById("inputCheckInDate").value = editReservation.CheckInDate;
    document.getElementById("inputCheckOutDate").value = editReservation.CheckOutDate;
    document.getElementById("inputPax").value = editReservation.NumberOfGuests;


    document.getElementById("editButton").addEventListener("click", function (event) {

      event.preventDefault();

      editReservation.CheckInDate = document.getElementById("inputCheckInDate").value;
      editReservation.CheckOutDate = document.getElementById("inputCheckOutDate").value;
      editReservation.NumberOfGuests = document.getElementById("inputPax").value;
      editReservation.BillingUnitNumber = document.getElementById("inputUnitNumber").value;
      editReservation.BillingStreetNumber = AddressNumberSplit(document.getElementById("inputAddress").value);
      editReservation.BillingStreetName = AddressSplit(document.getElementById("inputAddress").value);
      editReservation.BillingCity = document.getElementById("inputCity").value;
      editReservation.BillingProvince = document.getElementById("inputProvince").value;
      editReservation.BillingCountry = document.getElementById("inputCountry").value;
      editReservation.BillingPostalCode = document.getElementById("inputPostalCode").value;

      localStorage.setItem(substring, editReservation.serialize());
      location.href = "reservation-list.html";
    });
  }

  /**
  ******************************************************************************************************************************************************************************
  ***********************************************************************************ON-LOAD EVENT******************************************************************************
  ******************************************************************************************************************************************************************************
  */

  /**
   * This function determines what the page to call based on the title of the document in the head of the website. 
   * This function is called by the window when it loads. 
   */
  function Start() {
    console.log("App Started!");

    let typeOfUser = RetrieveKey();

    if (typeOfUser === "front_desk_agent") {
      AjaxRequest("employee-header", LoadHeader);
    }
    else {
      AjaxRequest("header", LoadHeader);
    }

    AjaxRequest("footer", LoadFooter);


    switch (document.title) {
      case "Home":
        DisplayHomePage();
        break;
      case "Rooms":
        DisplayRoomsPage();
        break;
      case "Reservations":
        DisplayReservationPage();
        break;
      case "Gallery":
        DisplayGalleryPage();
        break;
      case "About":
        DisplayAboutPage();
        break;
      case "Login":
        DisplayLoginPage();
        break;
      case "Register":
        DisplayRegisterPage();
        break;
      case "Employee Register":
        DisplayEmployeeRegisterPage();
        break;
      case "Reservation List":
        DisplayReservationListPage();
        break;
      case "Edit":
        DisplayReservationEditPage();
        break;
    }

  }

  window.addEventListener("Load", Start());
})();