(function (core) {

  /**
   * Creates an object of the reservation class. 
   * Includes check in date, check out date, number of guests, unit number, street number, street name, city, privince, country, postal code
   *
   * @class Reservation
   */
  class Reservation {

    // getters and setters

    get ReservationID() {
      return this.m_reservationId;
    }

    set ReservationID(reservation_id) {
      this.m_reservationId = reservation_id;
    }

    get CheckInDate() {
      return this.m_checkInDate;
    }

    set CheckInDate(check_in_date) {
      this.m_checkInDate = check_in_date;
    }

    get CheckOutDate() {
      return this.m_checkOutDate;
    }

    set CheckOutDate(check_out_date) {
      this.m_checkOutDate = check_out_date;
    }

    get NumberOfGuests() {
      return this.m_numberOfGuests;
    }

    set NumberOfGuests(number_of_guests) {
      this.m_numberOfGuests = number_of_guests;
    }

    get RoomNumber() {
      return this.m_roomNumber;
    }

    set RoomNumber(room_number) {
      this.m_roomNumber = room_number;
    }

    get BillingUnitNumber() {
      return this.m_billingUnitNumber;
    }

    set BillingUnitNumber(billing_unit_number) {
      this.m_billingUnitNumber = billing_unit_number;
    }

    get BillingStreetNumber() {
      return this.m_billingStreetNumber;
    }

    set BillingStreetNumber(billing_street_number) {
      this.m_billingStreetNumber = billing_street_number;
    }

    get BillingStreetName() {
      return this.m_billingStreetName;
    }

    set BillingStreetName(billing_street_name) {
      this.m_billingStreetName = billing_street_name;
    }

    get BillingCity() {
      return this.m_billingCity;
    }

    set BillingCity(billing_city) {
      this.m_billingCity = billing_city;
    }

    get BillingProvince() {
      return this.m_billingProvince;
    }

    set BillingProvince(billing_province) {
      this.m_billingProvince = billing_province;
    }

    get BillingCountry() {
      return this.m_billingCountry;
    }

    set BillingCountry(billing_country) {
      this.m_billingCountry = billing_country;
    }

    get BillingPostalCode() {
      return this.m_billingPostalCode;
    }

    set BillingPostalCode(billing_postal_code) {
      this.m_billingPostalCode = billing_postal_code;
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

    // Constructor
    /**
     * Creates an instance of Reservation.
     * @param {string} [checkInDate=""]
     * @param {string} [checkOutDate=""]
     * @param {number} [numberOfGuests=0]
     * @param {string} [billingUnitNumber=""]
     * @param {string} [billingStreetNumber=""]
     * @param {string} [billingStreetName=""]
     * @param {string} [billingCity=""]
     * @param {string} [billingProvince=""]
     * @param {string} [billingCountry=""]
     * @param {string} [billingPostalCode=""]
     * @memberof Reservation
     */
    constructor(reservationId = "", checkInDate = "", checkOutDate = "", numberOfGuests = 0, roomNumber = 0, billingUnitNumber = "", billingStreetNumber = "", billingStreetName = "", billingCity = "", billingProvince = "", billingCountry = "", billingPostalCode = "", dateCreated = "", lastUpdate = "") {
      this.ReservationID = reservationId;
      this.CheckInDate = checkInDate;
      this.CheckOutDate = checkOutDate;
      this.NumberOfGuests = numberOfGuests;
      this.RoomNumber = roomNumber;
      this.BillingUnitNumber = billingUnitNumber;
      this.BillingStreetNumber = billingStreetNumber;
      this.BillingStreetName = billingStreetName;
      this.BillingCity = billingCity;
      this.BillingProvince = billingProvince;
      this.BillingCountry = billingCountry;
      this.BillingPostalCode = billingPostalCode;
      this.DateCreated = dateCreated;
      this.LastUpdate = lastUpdate;
    }

    serialize() {
      // Determining if the values are actually filled out by the user.
      if (this.ReservationID !== "" && this.CheckInDate !== "" && this.CheckOutDate !== "" && this.NumberOfGuests !== "" && this.RoomNumber !== "" && this.BillingStreetNumber !== "" && this.BillingStreetName !== "" && this.BillingCity !== "" && this.BillingProvince !== "" && this.BillingCountry !== "" && this.BillingPostalCode !== "" && this.DateCreated !== "" && this.LastUpdate !== "") {
        return `${this.ReservationID},${this.CheckInDate},${this.CheckOutDate},${this.NumberOfGuests},${this.RoomNumber},${this.BillingUnitNumber},${this.BillingStreetNumber},${this.BillingStreetName},${this.BillingCity},${this.BillingProvince},${this.BillingCountry},${this.BillingPostalCode},${this.DateCreated},${this.LastUpdate}`;
      }

      // Console error actually stops JavaScript from processing
      console.error("One or more properties of the Reservation object are missing or invalid");
      return null;
    }

    deserialize(data) {
      let propertyArray = data.split(",");
      this.ReservationID = propertyArray[0];
      this.CheckInDate = propertyArray[1];
      this.CheckOutDate = propertyArray[2];
      this.NumberOfGuests = propertyArray[3];
      this.RoomNumber = propertyArray[4]
      this.BillingUnitNumber = propertyArray[5];
      this.BillingStreetNumber = propertyArray[6];
      this.BillingStreetName = propertyArray[7];
      this.BillingCity = propertyArray[8];
      this.BillingProvince = propertyArray[9];
      this.BillingCountry = propertyArray[10];
      this.BillingPostalCode = propertyArray[11];
      this.DateCreated = propertyArray[12];
      this.LastUpdate = propertyArray[13];
    }

    toString() {
      return `Check-In Date: ${this.CheckInDate} \nCheck-Out Date: ${this.CheckOutDate} \nNumber of Guests: ${this.NumberOfGuests}
    \nBilling Unit Number: ${this.BillingUnitNumber} \nBilling Street Number: ${this.BillingStreetNumber} \nBilling Street Name: ${this.BillingStreetName} 
    \nBilling City: ${this.BillingCity} \nBilling Province: ${this.BillingProvince} \nBilling Country: ${this.BillingCountry} 
    \nBilling Postal Code: ${this.BillingPostalCode} \nReservation Created: ${this.DateCreated} \nReservation Updated: ${this.LastUpdate} `;
    }

  }

  core.Reservation = Reservation;
})(core || (core = {}));