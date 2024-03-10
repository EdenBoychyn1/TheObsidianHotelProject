(function (core) {

  /**
   * Creates an object of the user class. 
   * Includes: First name, last name, username, email address, and password. 
   * @class User
   */
  class User {

    // getters and setters
    get FirstName() {
      return this.m_firstName;
    }

    set FirstName(first_name) {
      this.m_firstName = first_name;
    }

    get LastName() {
      return this.m_lastName;
    }

    set LastName(last_name) {
      this.m_lastName = last_name;
    }

    get UserName() {
      return this.m_userName;
    }

    set UserName(user_name) {
      this.m_userName = user_name;
    }

    get SecurityLevel() {
      return this.m_securityLevel;
    }

    set SecurityLevel(security_level) {
      this.m_securityLevel = security_level;
    }

    get EmailAddress() {
      return this.m_emailAddress;
    }

    set EmailAddress(email_address) {
      this.m_emailAddress = email_address;
    }

    get Password() {
      return this.m_password;
    }

    set Password(password) {
      this.m_password = password;
    }


    /**
     * Creates an instance of User.
     * @param {string} [firstName=""]
     * @param {string} [lastName=""]
     * @param {string} [userName=""]
     * @param {string} [emailAddress=""]
     * @param {string} [securityLevel=""]
     * @param {string} [password=""]
     * @memberof User
     */
    constructor(firstName = "", lastName = "", userName = "", emailAddress = "", securityLevel = "", password = "") {
      this.FirstName = firstName;
      this.LastName = lastName;
      this.UserName = userName;
      this.EmailAddress = emailAddress;
      this.SecurityLevel = securityLevel;
      this.Password = password;
    }

    /**
     * Read the mock data from the users.json file using this method when called. Returns properties of the mock data user object
     * "data" is just a firendly name that we have given the mock data file as input. "data" is our local identifier/alias for the input file
     * @param {*} data
     * @memberof User
     */
    fromJSON(data) {
      this.FirstName = data.FirstName;
      this.LastName = data.LastName;
      this.UserName = data.UserName;
      this.EmailAddress = data.EmailAddress;
      this.SecurityLevel = data.SecurityLevel;
      this.Password = data.Password;
    }


    // Public utility Methods 
    /**
     * Serialize returns a templated string that gets the values of the specific instance of the User object but only if the properties of the user class are not 
     * empty. If one or more of the properties are empty then an error message is called to the console and nothing is returned
     *
     * @return {string} 
     * @memberof User
     */
    serialize() {
      // Determining if the values are actually filled out by the user.
      if (this.FirstName !== "" && this.LastName !== "" && this.UserName !== "" && this.EmailAddress !== "" && this.SecurityLevel !== "" && this.Password !== "") {
        return `${this.FirstName},${this.LastName},${this.UserName},${this.EmailAddress},${this.SecurityLevel},${this.Password},`;
      }

      // Console error actually stops JavaScript from processing
      console.error("One or more properties of the User object are missing or invalid");
      return null;
    }

    /**
     * Deserialize the object by splitting it based on comma. 
     * Assume that data is in a comma-seperated format (string array of properties)
     * Splits the data and creates an array of substrings
     * @param {string} data
     * @memberof User
     */
    deserialize(data) {
      let propertyArray = data.split(",");
      this.FirstName = propertyArray[0];
      this.LastName = propertyArray[1];
      this.UserName = propertyArray[2];
      this.EmailAddress = propertyArray[3];
      this.SecurityLevel = propertyArray[4];
      this.Password = propertyArray[5];
    }

    // overridden methods

    /**
     * Overrides the built-in toString method of JavaScript's object class to create a templated string using interpolation to return all the values of the instance of an object. 
     *
     * @return {string} 
     * @memberof User
     */
    toString() {
      return `First Name: ${this.FirstName} \nLast Name: ${this.LastName} \nUsername: ${this.UserName} \nEmail Address: ${this.EmailAddress} \nSecurity Level: ${this.SecurityLevel}`;
    }

  }

  core.User = User;
})(core || (core = {}));