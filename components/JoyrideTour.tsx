// "use client";

// import { useEffect, useState } from 'react';
// import Joyride, { CallBackProps, STATUS } from 'react-joyride';

// export default function JoyrideTour() {
//   const [runTour, setRunTour] = useState(false);
  
//   useEffect(() => {
//     // Only start the tour for first-time users
//     const hasSeenTour = localStorage.getItem('hasSeenTour');
//     if (!hasSeenTour) {
//       setRunTour(true);
//     }
//   }, []);

//   const handleJoyrideCallback = (data: CallBackProps) => {
//     const { status } = data;
//     if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
//       // Save that the user has seen the tour
//       localStorage.setItem('hasSeenTour', 'true');
//     }
//   };

//   const steps = [
//     {
//       target: '.card-cta',
//       content: 'Welcome to Interviewly! This is where you can start practicing interviews.',
//       disableBeacon: true,
//     },
//     {
//       target: '.btn-primary',
//       content: 'Click here to generate an interview.',
//     },
//     {
//       target: '.interview-section',
//       content: 'Here you can see your past interviews and their feedback.',
//     },
//     {
//       target: '.available-interview',
//       content: 'Browse available interview types and start practicing!',
//     },
//   ];

//   return (
//     <Joyride
//       steps={steps}
//       run={runTour}
//       continuous
//       showSkipButton
//       showProgress
//       styles={{
//         options: {
//           primaryColor: '#5E4FDB',
//           backgroundColor: '#202020',
//           textColor: '#fff',
//         },
//       }}
//       callback={handleJoyrideCallback}
//     />
//   );
// }