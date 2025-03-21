function selectBeam(beamType) {
    window.location.href = `input.html?beamType=${beamType}`;
}

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const beamType = urlParams.get('beamType');
    if (beamType) {
        document.getElementById('beamTitle').textContent = `Input for ${
            beamType === 'simplySupportedPoint' ? 'Simply Supported (Point Load)' :
            beamType === 'cantileverPoint' ? 'Cantilever (Point Load)' :
            'Simply Supported (UDL)'
        }`;
        if (beamType !== 'simplySupportedPoint') {
            document.getElementById('loadPos').style.display = 'none';
        }
    }
};

function calculate() {
    const force = parseFloat(document.getElementById('force').value);
    const length = parseFloat(document.getElementById('length').value);
    const width = parseFloat(document.getElementById('width').value);
    const height = parseFloat(document.getElementById('height').value);
    const loadPos = parseFloat(document.getElementById('loadPos').value) || 0;
    const material = document.getElementById('material').value;

    const I = (width * height ** 3) / 12;
    const c = height / 2;
    const yieldStrength = material === 'steel' ? 250000000 : material === 'aluminum' ? 70000000 : 10000000;
    let moment;

    const beamType = new URLSearchParams(window.location.search).get('beamType');
    if (beamType === 'simplySupportedPoint') {
        moment = (force * loadPos * (length - loadPos)) / length;
    } else if (beamType === 'cantileverPoint') {
        moment = force * length;
    } else {
        moment = (force * length) / 8;
    }

    const stress = (moment * c) / I;
    const result = `
        Beam Type: ${beamType.replace('Point', ' Point Load').replace('UDL', ' Uniform Load')}
        Force: ${force} N
        Length: ${length} m
        Width: ${width} m
        Height: ${height} m
        ${beamType === 'simplySupportedPoint' ? `Load Position: ${loadPos} m\n` : ''}
        Max Bending Moment: ${moment.toFixed(2)} N·m
        Max Stress: ${stress.toFixed(2)} Pa
        Material: ${material.charAt(0).toUpperCase() + material.slice(1)}
        Safety: ${stress > yieldStrength ? 'Unsafe' : 'Safe'}
    `;
    alert(result); // Temporary output
}