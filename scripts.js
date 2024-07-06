const writers = [
    {
        name: "Մեսրոպ Մաշտոց",
        years: "362-440",
        description: "Հայոց այբուբենի ստեղծող, թարգմանիչ և մանկավարժ",
        century: 5,
        famousWorks: [
            { title: "Հայոց այբուբեն", year: "405" },
            { title: "Աստվածաշնչի թարգմանություն", year: "410-430" }
        ],
        birthplace: [40.1535, 44.1869], // Coordinates for Oshakan, Armenia
        linkToWorks: "https://eng.aybuben.com/mesrop-mashtots"
    },
    {
        name: "Մովսես Խորենացի",
        years: "410-490",
        description: "Պատմիչ, «Հայոց պատմության հայր»",
        century: 5,
        famousWorks: [
            { title: "Հայոց պատմություն", year: "482" },
            { title: "Աշխարհացոյց", year: "480" }
        ],
        birthplace: [40.5246, 43.9624],
        linkToWorks: "https://eng.aybuben.com/movses-horenaci"
    },
    {
        name: "Խաչատուր Աբովյան",
        years: "1809-1848",
        description: "Հայ գրող, մանկավարժ, հրապարակախոս, հայրենասեր, հայ նոր գրականության հիմնադիր",
        century: 19,
        famousWorks: [
            { title: "Վերք Հայաստանի", year: "1841" }
        ],
        birthplace: [40.1811, 44.5145], // Coordinates for Kanaker, Armenia
        linkToWorks: "https://eng.aybuben.com/khachatur-abovyan"
    },
    {
        name: "Վահագն Դավթյան",
        years: "1922-1996",
        description: "Հայ բանաստեղծ, գրականագետ, լրագրող",
        century: 20,
        famousWorks: [
            { title: "Սասունցիների ծագումը", year: "1956" },
            { title: "Երկիր ու Մարդ", year: "1968" }
        ],
        birthplace: [40.1811, 44.5145], // Coordinates for Yerevan, Armenia
        linkToWorks: "https://eng.aybuben.com/vahagn-davtyan"
    }
];


let map;

function createTimeline() {
    const timeline = document.getElementById('timeline');
    writers.sort((a, b) => parseInt(a.years.split('-')[0]) - parseInt(b.years.split('-')[0]));
    
    writers.forEach((writer, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.classList.add('timeline-item');
        timelineItem.dataset.century = writer.century;
        timelineItem.innerHTML = `
            <div class="timeline-content">
                <h2>${writer.name}</h2>
                <p>${writer.years}</p>
            </div>
        `;
        timelineItem.addEventListener('click', () => showWriterDetails(writer));
        timeline.appendChild(timelineItem);
    });
}

function showWriterDetails(writer) {
    const writerInfo = document.getElementById('writer-info');
    const famousWorks = document.getElementById('famous-works');
    const worksLinkButton = document.getElementById('works-link-button');

    writerInfo.innerHTML = `
        <h1>${writer.name}</h1>
        <p><strong>Տարիներ:</strong> ${writer.years}թթ․</p>
        <p><strong>Դար:</strong> ${writer.century}-րդ</p>
        <p>${writer.description}</p>
    `;

    famousWorks.innerHTML = `
        <h2>Հայտնի գործերը</h2>
        ${writer.famousWorks.map(work => `
            <div class="work-item">
                <h4>${work.title}</h4>
                <p>Թվական(ներ): ${work.year}</p>
            </div>
        `).join('')}
    `;

    // Set the link URL
    worksLinkButton.href = writer.linkToWorks; // Use writer's linkToWorks field
    worksLinkButton.textContent = 'Կարդալ հեղինակի գործերը'; // Button text

    writerInfo.classList.add('fade-in');
    famousWorks.classList.add('fade-in');

    setTimeout(() => {
        writerInfo.classList.remove('fade-in');
        famousWorks.classList.remove('fade-in');
    }, 500);

    updateMap(writer);
}


function initMap() {
    map = L.map('map').setView([40.1872, 44.5152], 7); // Centered on Armenia
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

function updateMap(writer) {
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
    L.marker(writer.birthplace).addTo(map)
        .bindPopup(`${writer.name}ի ծննդավայր`)
        .openPopup();
    map.setView(writer.birthplace, 10);
}

function initSearch() {
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            const writerName = item.querySelector('h2').textContent.toLowerCase();
            if (writerName.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

function initCenturyFilter() {
    const centuryFilter = document.getElementById('century-filter');
    const centuries = [...new Set(writers.map(writer => writer.century))].sort((a, b) => a - b);
    centuries.forEach(century => {
        const option = document.createElement('option');
        option.value = century;
        option.textContent = `${century}-րդ դար`;
        centuryFilter.appendChild(option);
    });

    centuryFilter.addEventListener('change', () => {
        const selectedCentury = centuryFilter.value;
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            if (selectedCentury === 'all' || item.dataset.century === selectedCentury) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
}


function scrollToCentury() {
    const centuryFilter = document.getElementById('century-filter');
    centuryFilter.addEventListener('change', () => {
        const selectedCentury = centuryFilter.value;
        if (selectedCentury !== 'all') {
            const firstWriterOfCentury = document.querySelector(`.timeline-item[data-century="${selectedCentury}"]`);
            if (firstWriterOfCentury) {
                firstWriterOfCentury.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    createTimeline();
    initMap();
    initSearch();
    initCenturyFilter();
    scrollToCentury();

    // Show details of the first writer by default
    if (writers.length > 0) {
        showWriterDetails(writers[0]);
    }
});