const service = Symbol();
const deviceName = Symbol();

/**
 * This class uses the bluez device API to read and set properties of the connected BLE user.
 * When a remote client connects to this peripheral a representation of the remote device’s configuration is created by BlueZ.  
 * This API can be used to manage the properties of that remote client.
 * For more information see https://git.kernel.org/pub/scm/bluetooth/bluez.git/tree/doc/device-api.txt
 * 
 * * **DBus**: Is ad Dbus object to the systembus
 * 
 * @param {object} DBus
 */

class device{
    constructor(DBus = {}){
        this[service] = DBus.getService('org.bluez');
        this[deviceName] = 'org.bluez.Device1';
    }

    /**
     * Reads the value of a property.  Returns a promise that can be used with async and await commands.
     * @param {*} propertyName 'Trusted'
     * @param {*} deviceObjPath '/org/bluez/hci0/dev_00_DB_70_C8_0C_7F'
     */
    getProperty(propertyName =  'Trusted', deviceObjPath = '/org/bluez/hci0/dev_00_DB_70_C8_0C_7F'){  
        var promise = new Promise((resolve, reject)=>{
            this[service].getInterface(deviceObjPath, 'org.freedesktop.DBus.Properties', (err, iface) => {
                if(err){
                    console.error('Failed to request interface ' + iface + ' at ' + deviceObjPath);
                    console.error(err);
                    reject(new Error('Failed to request interface ' + iface + ' at ' + deviceObjPath));
                }
                iface.Get( this[deviceName], propertyName, (err, str) => {
                    if (err) {
                        //console.error('Error while calling interface ' + iface + ' at ' + deviceObjPath + ', for ' + propertyName);
                        reject('Error looking up ' + propertyName + ' for ' + deviceObjPath);
                    } else if (str) {
                        var x = str[1].toString();
                        if(x == 'true'){x = true;}
                        else if(x == 'false'){x = false;};
                        //console.log(propertyName + ' = ' + x );
                        resolve(x);
                    }
                });
            });
        });
    return promise;
    };

    /**
     * Logs all properties for deviceObjPath to the console. Used during develoment to get a list of properties.
     * @param {*} deviceObjPath '/org/bluez/hci0/dev_00_DB_70_C8_0C_7F'
     */
    logAllProperties(deviceObjPath = '/org/bluez/hci0/dev_00_DB_70_C8_0C_7F'){
        this[service].getInterface(deviceObjPath, 'org.freedesktop.DBus.Properties', (err, iface) => {
        if(err){
          console.error('Failed to request interface ' + iface + ' at ' + deviceObjPath);
          console.error(err);
          return;
        }
          //iface.GetAll( pInterfanceName, (err, str) => {
          console.log('calling GetAll...');
          iface.GetAll(this[deviceName], (err,str) => {
            if (err) {
            console.error(`Error while calling GetAll: ${err}`);
            } else if (str) {
              console.log('Get All returned:');
              if(Array.isArray(str)){
                str.forEach(function(val, index){
                  var detailsObj = val[1][0][0]
                  console.log('\t' + val[0] + ' : ' + val[1][1] + ', of type -> ' + detailsObj.type + ' <-.');
                })
                return str
              } else {
                console.log(str);
              }
            }
          });
        })    
    };

     /**
     * Sets the boolean value of a property.  For a list of propertyNames call to logAllProperties.
     * This method can only be used to set properties that have boolean vlues (true or false)
     * @param {string} propertyName 'Trusted'
     * @param {boolean} value true
     * @param {string} deviceObjPath '/org/bluez/hci0/dev_00_DB_70_C8_0C_7F'
     */
    setBooleanProperty(propertyName =  'Trusted', value = true, deviceObjPath = '/org/bluez/hci0/dev_00_DB_70_C8_0C_7F'){
        this[service].getInterface(deviceObjPath, 'org.freedesktop.DBus.Properties', (err, iface) => {
            if(err){
                console.error('Failed to SetProperty interface ' + iface + ' at ' + deviceObjPath);
                console.error(err);
                return;
            }
            iface.Set( this[deviceName], propertyName, ["b",value], (err, str) => {
                if (err) {
                console.error('Error while calling setProperty interface ' + iface + ' at ' + deviceObjPath + ', for ' + propertyName);
                } else if (str) {
                console.log(propertyName + ' = ' + str[1]);
                return str[1];
                }
            });
        })
    };


};

module.exports = device;