document.getElementById('fileInput').addEventListener('change', function(event) {
	const file = event.target.files[0];
	if (!file) {
		return;
	}

	readAndDisplayFile(file);
});

function readAndDisplayFile(file, callback) {
	const reader = new FileReader();
	reader.onload = function(e) {
		try {
			const arrayBuffer = e.target.result;
			const bytes = new Uint8Array(arrayBuffer);

			// Sanity check: must be exactly 768 bytes (256 colors * 3)
			if (bytes.length < 768) {
				alert('Invalid file: less than 768 bytes.');
				callback?.(false);
				return;
			}

			displayPalette(bytes);
			callback?.(true);
		} catch (err) {
			console.error('Error while reading file:', err);
			callback?.(false);
		}
	};

	reader.onerror = function() {
		console.error('FileReader error:', reader.error);
		callback?.(false);
	};

	reader.readAsArrayBuffer(file);
}

function displayPalette(bytes) {
	const paletteContainer = document.getElementById('palette');
	paletteContainer.innerHTML = '';

	for (let i = 0; i < 256; i++) {
		const r = bytes[i * 3];
		const g = bytes[i * 3 + 1];
		const b = bytes[i * 3 + 2];

		const colorDiv = document.createElement('div');
		colorDiv.className = 'color';
		colorDiv.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

		const label = document.createElement('div');
		label.className = 'color-label';
		label.textContent = i;
		label.addEventListener('click', async (e) => {
			e.stopPropagation();
			const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
			const text = `Index ${i}: RGB(${r}, ${g}, ${b}), HEX(${hex.toUpperCase()})`;
			try {
				await navigator.clipboard.writeText(text);
				alert(`Copied to clipboard:\n${text}`);
			} catch {
				alert(text);
			}
		});

		colorDiv.appendChild(label);
		paletteContainer.appendChild(colorDiv);
	}
}
