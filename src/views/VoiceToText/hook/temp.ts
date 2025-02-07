// const startRecording = async () => {
//   ElMessage.info('开始录制音频');
//   audioUrrentTimeSeconds.value = 0;
//   audioUrrentTime.value = 0;
//   CurrentFile.value = new Date().toLocaleString() + '.webm';
//   InputFileFormat.value = '.wav'; /////传输文件的格式
//   tableData.value = [];
//   tableData.value.unshift({
//     FilesName: CurrentFile.value,
//   });
//   const getBrowserName = () => {
//     const userAgent = navigator.userAgent;
//     if (userAgent.indexOf('Chrome') !== -1) {
//       return true;
//     } else if (userAgent.indexOf('Firefox') !== -1) {
//       return true;
//     } else if (userAgent.indexOf('Safari') !== -1 && userAgent.indexOf('Chrome') === -1) {
//       return true;
//     } else if (userAgent.indexOf('Edge') !== -1) {
//       return false;
//     } else if (userAgent.indexOf('Opera') !== -1) {
//       return false;
//     } else {
//       return false;
//     }
//   };

//   try {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     audioChunks.value = [];
//     mediaRecorder.value = new MediaRecorder(stream);

//     // 启动录音
//     InputLanguage.value = '麦克风录制';
//     audioUrrentTimeSeconds.value = 0;
//     audioUrrentTime.value = 0;
//     audiototalTime.value = 0; // 总时长
//     audiototalTimeSeconds.value = 0;

//     const startit = await mediaRecorder.value.start();
//     const startTime = new Date();

//     mediaRecorder.value.ondataavailable = (event) => {
//       audioChunks.value.push(event.data);
//     };
//     mediaRecorder.value.onstop = async () => {
//       const endTime = new Date();
//       const temptime = (endTime - startTime) / 1000 - 0.12;

//       if (temptime < 1) {
//         isTooshort.value = true;
//         return;
//       }
//       recordingTime.value = temptime; // 录音时长
//       const audioBlob = new Blob(audioChunks.value, { type: 'audio/webm' });
//       audioUrl.value = URL.createObjectURL(audioBlob);
//       audio.value = new Audio(audioUrl.value); // 创建 audio 元素
//       console.log(audioBlob);

//       console.log(audio.value);

//       audio.value.onloadedmetadata = () => {
//         audiototalTime.value = recordingTime.value;
//       };
//       // audio.value.onended = () => {
//       //   isPlaying.value = false;
//       //   CurrentRecordingIcon.value = recordingIcon.value[0];
//       //   shaowRecordingIcon.value = false;
//       //   showDefaultRecordingIcon.value = true;
//       // };
//     };
//   } catch (error) {
//     ElMessage.error('录音失败');
//     alert('请允许使用麦克风');
//   }
// };


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// if (Math.floor(audio.value.currentTime) % 3 === 0) {
//   const highlightedText = highlightText();
//   const textOutput = document.getElementById('text-output'); //文本显示在id为text - output的元素中
//   if (textOutput) {
//     textOutput.innerHTML = highlightedText;
//     hljs.highlightAll();
//     currentHighlightIndex = (currentHighlightIndex + 1) % lines.length; // 更新高亮索引，循环遍历   }
//   }
// }

// if (Math.floor(audio.value.currentTime * 1000) % 3 === 0) {
//   const highlightedText = highlightText();
//   const textOutput = document.getElementById('text-output'); //文本显示在id为text - output的元素中
//   console.log(textOutput);

//   if (textOutput) {
//     textOutput.innerHTML = highlightedText;
//     hljs.highlightAll();
//     currentHighlightIndex = (currentHighlightIndex + 1) % texts_with_timecoppy.value.length; // 更新高亮索引，循环遍历   }
//   }
// }

// new Promise((resolve, reject) => {
//   reader.onload = e => {
//     if (e.target) {
//       const audioObj = new Audio(String(e.target.result));
//       audio.value = audioObj;
//       audioBase64.value = e.target.result;
//       audioBase64.value = audioBase64.value.replace('data:audio/wav;base64,', '');
//       audioObj.src = String(e.target.result); //base64的格式
//       audioObj.onloadedmetadata = () => {
//         audiototalTime.value = audioObj.duration; // 获取音频时长（单位为秒）
//         CurrentFile.value = file.name;
//         resolve();
//       };
//     }
//   };
// }).then(() => {
//  // upload;
// });
// reader.readAsDataURL(file);
// if (!fileExtension.value || !audioBase64.value) {
//   ElMessage.error('没有可以运行的文件');
//   return false;
// }


/////////////////////文本高亮函数

// const highlightText = () => {
//   const newLines = [];
//   for (let i = 0; i < texts_with_timecoppy.value.length; i++) {
//     const currentLine = texts_with_timecoppy.value[i].text;
//     if (flag) {
//       if (i === currentindex || i === currentindex + 1) {
//         newLines.push(`<span class="hljs-keyword">${currentLine}</span>`);
//       } else {
//         newLines.push(currentLine);
//       }
//     } else {
//       if (i === currentHighlightIndex) {
//         newLines.push(`<span class="hljs-keyword">${currentLine}</span>`);
//         currentHighlightIndex = (currentHighlightIndex + 1) % texts_with_timecoppy.value.length;
//       } else {
//         newLines.push(currentLine);
//       }
//     }
//   }
//   return newLines.join('\n');
// };


//////////////////////////////////////////////////////////////////////////////////////////监听器
// let flag = false;
// const clickTextToHighlight = () => {
//   flag = true;
// };
// let watchflag = false;
// let throttleTimer = null; // 用于节流的定时器引用
// const throttleDelay = 5; // 节流延迟时间（单位：毫秒)
// let currentHighlightIndex = 0;
// let precurrentHighlightIndex = -1;
// const throttle = (callback) => {
//   if (!throttleTimer) {
//     callback();
//     throttleTimer = setTimeout(() => {
//       throttleTimer = null;
//     }, throttleDelay);
//   }
// };

// watch(
//   () => audioUrrentTimeSeconds.value,
  
//   (newValue, oldValue) => {
//     console.log(watchflag);
//     console.log(currentHighlightIndex);
    
//     if (!flag) {
//       if (newValue === 0) {
//         elementStyle.value = -1;
//         currentHighlightIndex = 0;
//       } else if (oldValue === 0) {
//         currentHighlightIndex = 1;
//       }
//       if (!watchflag) {
//         if (currentHighlightIndex - 1 <= textsStartTime.value.length) {
//           const currentItem = textsStartTime.value[currentHighlightIndex - 1];
//           if (currentItem && newValue >= currentItem.startTime && newValue < currentItem.endTime) {
//             watchflag = true;
//             elementStyle.value = currentHighlightIndex;
//             const settingTime = (currentItem.endTime - currentItem.startTime) * 1000;
//             throttle(() => {
//               setTimeout(() => {
//                 watchflag = false;
//                 if (currentHighlightIndex - 1 <= textsStartTime.value.length) {
//                   currentHighlightIndex++;
//                 }
//               }, settingTime);
//             });
//           }
//         }
//       }
//     } else {
//       flag = false;
//       for (let i = 0; i < textsStartTime.value.length; i++) {
//         if (newValue >= textsStartTime.value[i].startTime && newValue <= textsStartTime.value[i].endTime) {
//           watchflag = true;
//           const currentItem = textsStartTime.value[i];
//           currentHighlightIndex = i + 1;
//           precurrentHighlightIndex = i + 2;
//          // elementStyle.value = currentHighlightIndex;
//           //elementStyle2.value = precurrentHighlightIndex;
//           throttle(() => {
//             const settingTime = (currentItem.endTime - newValue) * 1000;
//             setTimeout(() => {
//               watchflag = false;
//               if (currentHighlightIndex - 1 <= textsStartTime.value.length) {
//                 precurrentHighlightIndex = -1;
//                 elementStyle2.value=-1
//               }
//             }, settingTime);
//           });
//         }
//       }
//     }
//   },
// );

