var table = [];
var poly = 0xEDB88320; // reverse polynomial

function makeTable() {
	var c, n, k;

	for (n = 0; n < 256; n += 1) {
		c = n;
		for (k = 0; k < 8; k += 1) {
			if (c & 1) {
				c = poly ^ (c >>> 1);
			} else {
				c = c >>> 1;
			}
		}
		table[n] = c >>> 0;
	}
}

function strToArr(str) {
	// sweet hack to turn string into a 'byte' array
	return Array.prototype.map.call(str, function (c) {
		return c.charCodeAt(0);
	});
}

function crcDirect(arr) {
	var crc = -1, // initial contents of LFBSR
		i, j, l, temp;

	for (i = 0, l = arr.length; i < l; i += 1) {
		temp = (crc ^ arr[i]) & 0xff;

		// read 8 bits one at a time
		for (j = 0; j < 8; j += 1) {
			if ((temp & 1) === 1) {
				temp = (temp >>> 1) ^ poly;
			} else {
				temp = (temp >>> 1);
			}
		}
		crc = (crc >>> 8) ^ temp;
	}

	// flip bits
	return crc ^ -1;
}


function crcTable(arr, append) {
	var crc, i, l;

	// if we're in append mode, don't reset crc
	// if arr is null or undefined, reset table and return
	if (typeof crcTable.crc === 'undefined' || !append || !arr) {
		crcTable.crc = 0 ^ -1;

		if (!arr) {
			return;
		}
	}

	// store in temp variable for minor speed gain
	crc = crcTable.crc;

	for (i = 0, l = arr.length; i < l; i += 1) {
		crc = (crc >>> 8) ^ table[(crc ^ arr[i]) & 0xff];
	}

	crcTable.crc = crc;

	return crc ^ -1;
}

makeTable();

export function crc32(val, direct) {
	var val = (typeof val === 'string') ? strToArr(val) : val,
		ret = direct ? crcDirect(val) : crcTable(val);

	// convert to 2's complement hex
	return (ret >>> 0).toString(16);
};
