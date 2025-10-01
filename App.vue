<template>
  <div class="dashboard">
    <h1>Hydromind Dashboard</h1>

    <div class="cards" v-if="latestData">
      <div class="card">
        <h2>TDS</h2>
        <p class="tds">{{ latestData.tds.toFixed(2) }} mg/L</p>
      </div>
      <div class="card">
        <h2>pH</h2>
        <p class="ph">{{ latestData.ph.toFixed(2) }}</p>
      </div>
      <div class="card">
        <h2>Temperature</h2>
        <p class="temp">{{ latestData.temp.toFixed(2) }} °C</p>
      </div>
    </div>

    <div class="chart-container">
      <canvas id="waterChart"></canvas>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, computed } from "vue";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Legend,
  Tooltip,
} from "chart.js";

// Register chart.js components
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Legend,
  Tooltip
);

export default {
  setup() {
    const state = reactive({
      data: [],
    });

    const latestData = computed(() => state.data[state.data.length - 1]);



    onMounted(async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        console.log("Fetching from:", API_URL); // 👈 helps debug
        const response = await fetch(`${API_URL}/?password=HAMMASgobrrrrrr`);
        const waterData = await response.json();
        state.data = waterData;
        console.log(waterData);
      } catch (error) {
        console.error("Error:", error);
      }

      const ctx = document.getElementById("waterChart").getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: state.data.map((d) =>
            new Date(d.time).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })
          ),
          datasets: [
            {
              label: "TDS ( X 10 mg/L)",
              data: state.data.map((d) => d.tds * 0.1),
              borderColor: "rgba(75, 192, 192, 1)",
              fill: false,
              tension: 0.3,
            },
            {
              label: "pH",
              data: state.data.map((d) => d.ph),
              borderColor: "rgba(153, 102, 255, 1)",
              fill: false,
              tension: 0.3,
            },
            {
              label: "Temperature (°C)",
              data: state.data.map((d) => d.temp),
              borderColor: "rgba(255, 159, 64, 1)",
              fill: false,
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
          },
        },
      });
    });

    return { latestData };
  },
};
</script>

<style>
body {
  font-family: sans-serif;
}
</style>
