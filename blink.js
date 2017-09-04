var connectionId = -1;
var readBuffer = "";
let uid = null;

function setPosition(position) {
    var buffer = new ArrayBuffer(1);
    var uint8View = new Uint8Array(buffer);
    uint8View[0] = position;
    chrome.serial.send(connectionId, buffer, function() {});
};

function onRead(readInfo) {
    uid = new TextDecoder().decode(readInfo.data);
    console.log('UID do cartão:' + uid);
    showCustomerName(uid);
    showTotal();
};

function showCustomerName(uid) {
    if(uid === '00 96 1B 83')
	$('#customer-name').val("Victor Teodoro");
    else if (uid === '70 59 FD 73')
	$('#customer-name').val("André Cavalcante");
}

function showTotal() {
    let total = Number($('#num-of-burgers').val())*25 + Number($('#num-of-sodas').val())*5
    $('#bill-total').val('R$ ' + total.toFixed(2));
}

function onOpen(openInfo) {
    connectionId = openInfo.connectionId;
    console.log("connectionId: " + connectionId);
    if (connectionId == -1) {
	setStatus('Could not open');
	return;
    }
    //setStatus('Connected');

    //setPosition(0);
    chrome.serial.onReceive.addListener(onRead);
};

function setStatus(status) {
    document.getElementById('status').innerText = status;
}

function buildPortPicker(ports) {
    /*
    var eligiblePorts = ports.filter(function(port) {
	return !port.match(/[Bb]luetooth/) && port.match(/COM\[1-9]+/);
    });
    */

    var portPicker = document.getElementById('port-picker');
    for(let port of ports) {
	console.log(port);
	var portOption = document.createElement('option');
	portOption.value = portOption.innerText = port.path;
	portPicker.appendChild(portOption);
    }

    portPicker.onchange = function() {
	if (connectionId != -1) {
	    chrome.serial.disconnect(connectionId, openSelectedPort);
	    return;
	}
	openSelectedPort();
    };
}

function openSelectedPort() {
    var portPicker = document.getElementById('port-picker');
    var selectedPort = portPicker.options[portPicker.selectedIndex].value;
    chrome.serial.connect(selectedPort, null, onOpen);
}

onload = function() {
    /*
    document.getElementById('position-input').onchange = function() {
	setPosition(parseInt(this.value, 10));
    };
    */

    chrome.serial.getDevices(function(ports) {
	buildPortPicker(ports)
	openSelectedPort();
    });
};
