(function (core) {

  class Room {

    get RoomNumber() {
      return this.m_roomNumber;
    }

    set RoomNumber(room_number) {
      this.m_roomNumber = room_number;
    }

    get RoomDescription() {
      return this.m_roomDescription;
    }

    set RoomDescription(room_description) {
      this.m_roomDescription = room_description;
    }

    get RoomType() {
      return this.m_roomType;
    }

    set RoomType(room_type) {
      this.m_roomType = room_type;
    }

    get RoomPrice() {
      return this.m_roomPrice;
    }

    set RoomPrice(room_price) {
      this.m_roomType = room_price;
    }

    get RoomStatus() {
      return this.m_roomStatus;
    }

    set RoomStatus(room_status) {
      this.m_roomStatus = room_status;
    }

    get RoomAccessible() {
      return this.m_roomAccessible;
    }

    set RoomAccessible(room_accessible) {
      this.m_roomAccessible = room_accessible;
    }

    get LastUpdate() {
      return this.m_lastUpdate;
    }

    set LastUpdate(last_update) {
      this.m_lastUpdate = Date.now();
    }

    /**
     * Creates an instance of Room.
     * @param {number} [room_number=""]
     * @param {string} [room_description=""]
     * @param {string} [room_type=""]
     * @param {number} [room_price=""]
     * @param {string} [room_status=""]
     * @param {boolean} [room_accessible=""]
     * @param {string} [room_bed=""]
     * @param {string} [last_update=""]
     * @memberof Room
     */
    constructor(room_number = "", room_description = "", room_type = "", room_price = 0.00, room_status = "", room_accessible = 1, last_update = "") {
      this.RoomNumber = room_number;
      this.RoomDescription = room_description;
      this.RoomType = room_type;
      this.RoomPrice = room_price;
      this.RoomStatus = room_status;
      this.RoomAccessible = room_accessible;
      this.LastUpdate = last_update;
    }
  }

  core.Room = Room;
})(core || (core = {}));