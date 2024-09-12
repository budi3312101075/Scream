import React, { useEffect, useState } from "react";
import Wave from "react-wavify";

const ScreamMeter = () => {
  const [volume, setVolume] = useState(0);
  const [succes, setSucces] = useState(false);

  useEffect(() => {
    const handleAudio = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);

      source.connect(analyser);
      analyser.fftSize = 2048;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        const sum = dataArray.reduce((a, b) => a + b, 0);
        const average = sum / bufferLength;
        setVolume(average);
        requestAnimationFrame(updateVolume);
      };

      updateVolume();
    };

    handleAudio();
  }, []);

  const volumePercentage = Math.min(100, Math.max(0, (volume / 256) * 150));

  const countVolume = 1920 - volumePercentage * 10;
  // kalau angka yang dikali mangkin besar maka mangkin mudah untuk naik jika mangkin kecil maka semakin mudah

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <h1 className="text-black text-center mt-10">Scream Meter</h1>
      <p className="text-black text-center">
        Your volume is: {volume.toFixed(2)}% <br />
        Your scream volume is: {volumePercentage.toFixed(2)}%
        <br />
        countVolume is: {countVolume.toFixed(0)}
      </p>
      {succes ? (
        <div className="z-50 relative">
          <img
            className="mx-auto"
            src="https://zeevector.com/wp-content/uploads/Clipart/Carnival-Logo-Vector-PNG.png"
            alt=""
          />
        </div>
      ) : (
        <div>
          <img
            className="absolute top-0 left-0 w-full h-full object-cover -z-10"
            src="https://marketplace.canva.com/EAFaFu7i01Y/1/0/1131w/canva-red-and-white-minimalist-carnival-fun-fair-flyer-29Yg7x2Rqu4.jpg"
            alt="background"
          />
        </div>
      )}

      {/* wavify */}
      <div>
        <Wave
          className="absolute bottom-0 h-full opacity-100"
          fill="#f79902"
          paused={false}
          style={{ display: "flex" }}
          options={{
            height: countVolume,
            amplitude: 60,
            speed: 0.25,
            points: 4,
          }}
        />
        <Wave
          className="absolute bottom-0 h-full opacity-80"
          fill="#f79902"
          paused={false}
          style={{ display: "flex" }}
          options={{
            height: countVolume,
            amplitude: 30,
            speed: 0.25,
            points: 4,
          }}
        />
      </div>
    </div>
  );
};

export default ScreamMeter;
