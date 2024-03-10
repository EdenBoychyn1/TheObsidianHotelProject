(function (core) {

  /**
   * Creates an instance of the guest class which is the child class of user.
   *
   * @class Guest
   * @extends {User}
   */
  class Guest extends core.User {

    // Getters and Setters
    get UnitNumber() {
      return this.m_unitNumber;
    }

    set UnitNumber(unit_number) {
      this.m_unitNumber = unit_number;
    }

    get StreetNumber() {
      return this.m_streetNumber;
    }

    set StreetNumber(street_number) {
      this.m_streetNumber = street_number;
    }

    get StreetName() {
      return this.m_streetName;
    }

    set StreetName(street_name) {
      this.m_streetName = street_name;
    }

    get City() {
      return this.m_city;
    }

    set City(city) {
      this.m_city = city;
    }

    get Province() {
      return this.m_province;
    }

    set Province(province) {
      this.m_province = province;
    }

    get Country() {
      return this.m_country;
    }

    set Country(country) {
      this.m_country = country;
    }

    get PostalCode() {
      return this.m_postalCode;
    }

    set PostalCode(postal_code) {
      this.m_postalCode = postal_code;
    }

    get DateCreated() {
      return this.m_createdDate;
    }

    set DateCreated(date_created) {
      this.m_createdDate = Date.now();
    }

    get LastUpdate() {
      return this.m_lastUpdate;
    }

    set LastUpdate(last_update) {
      this.m_lastUpdate = Date.now();
    }

    // Constructors 
    constructor(firstName = "", lastName = "", userName = "", emailAddress = "", securityLevel = "", password = "", unitNumber = "", streetNumber = "", streetName = "", city = "", province = "", country = "", postal_code = "", dateCreated = "", lastUpdate = "") {
      super(firstName, lastName, userName, emailAddress, securityLevel, password);
      this.UnitNumber = unitNumber;
      this.StreetNumber = streetNumber;
      this.StreetName = streetName;
      this.City = city;
      this.Province = province;
      this.Country = country;
      this.PostalCode = postal_code;
      this.DateCreated = dateCreated;
      this.LastUpdate = lastUpdate;
    }

    deserialize(data) {
      super.deserialize(data);
      let propertyArray = data.split(",");
      this.UnitNumber = propertyArray[6];
      this.StreetNumber = propertyArray[7];
      this.StreetName = propertyArray[8];
      this.City = propertyArray[9];
      this.Province = propertyArray[10];
      this.Country = propertyArray[11];
      this.PostalCode = propertyArray[12];
      this.DateCreated = propertyArray[13];
      this.LastUpdate = propertyArray[14];
    }

    // Utility Methods

    /**
     *
     *
     * @return {string} 
     * @memberof Guest
     */
    serialize() {
      // Determining if the values are actually filled out by the user.
      if (this.StreetNumber !== "" && this.StreetName !== "" && this.City !== "" && this.Province !== "" && this.Country !== "" && this.PostalCode !== "" && this.DateCreated !== "" && this.LastUpdate !== "") {
        return `${super.serialize()}${this.UnitNumber},${this.StreetNumber},${this.StreetName},${this.City},${this.Province},${this.Country},${this.PostalCode},${this.DateCreated},${this.LastUpdate}`;
      }

      // Console error actually stops JavaScript from processing
      console.error("One or more properties of the Guest object are missing or invalid");
      return null;
    }


    /**
     *
     *
     * @return {string} 
     * @memberof Guest
     */
    toString() {
      return `${super.toString()} \nUnit Number: ${this.UnitNumber} \nStreet Number: ${this.StreetNumber} \nStreetName: ${this.StreetName} \nCity: ${this.City} \nProvince: ${this.Province} \nCountry: ${this.Country} \nDateCreated: ${this.DateCreated} \nLastUpdate: ${this.LastUpdate}`;
    }

  }

  core.Guest = Guest;
})(core || (core = {}));