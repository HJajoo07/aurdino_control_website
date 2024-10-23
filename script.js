document.addEventListener('DOMContentLoaded', () => {
    const dataList = document.getElementById('data-list');

    // Function to fetch and display data
    const fetchData = async () => {
        try {
            const response = await fetch('/data');
            const result = await response.json();

            // Clear the existing data
            dataList.innerHTML = '';

            // Display each data item
            result.data.forEach(item => {
                const div = document.createElement('div');
                div.className = 'data-item';
                div.textContent = item;
                dataList.appendChild(div);
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Fetch data initially and refresh every 5 seconds
    fetchData();
    setInterval(fetchData,5000);
});
