import {
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react';
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Avatar, Button, CircularProgress, Grid } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import OptionMap from './OptionMap.json';
import { askGPT } from '../../services/ChatApi';
import {
  bold_name,
  btn,
  circularprog,
  df_jc_ac,
  df_jc_ac_fdc,
  ptag,
} from '../../theme/CssMy';
import moment from 'moment-timezone';
import userImg from '../../images/user.png';
import logo from '../../images/chatbot.png';
import { FountainParser } from 'screenplay-js';
import html2pdf from 'html2pdf.js';
import { getHome, updateMe } from '../../services/userServices';
import { uploadImg } from '../../services/ipfsServicesApi';
import shorthash from 'shorthash';
import { useNavigate } from 'react-router';
import { ybcontext } from '../../context/MainContext';
import successHandler from '../toasts/successHandler';
import errorHandler from '../toasts/errorHandler';
import { Icon } from '@iconify/react';

export default function Chat2() {
  const inputRef = useRef();
  const user = JSON.parse(localStorage.getItem('ybUser'));
  const { setUser, account, fetchPendingScripts, pendingScripts, open2 } =
    useContext(ybcontext);
  const [msgInputValue, setMsgInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [contentType, setContentType] = useState(null);
  const [genre, setGenre] = useState(null);
  const [temporality, setTemporality] = useState(null);
  const [hasPitchIdea, setHasPitchIdea] = useState(null);
  const [hasSynopsis, setHasSynopsis] = useState(null);
  const [enableTF, setEnableTF] = useState(false);
  const [disableTF, setDisableTF] = useState(false);
  const [current, setCurrent] = useState(undefined);
  const [finalScript, setFinalScript] = useState('');
  const [saveLoad, setSaveLoad] = useState(false);
  const [download, setDownload] = useState(false);
  const [showIdeas, setShowIdeas] = useState([]);
  const [showSynopsis, setShowSynopsis] = useState([]);
  const navigate = useNavigate();
  const [generating, setGenerating] = useState(false);
  const [ideasType, setIdeasType] = useState(false);
  const [synopsisType, setSynopsisType] = useState(false);
  const topics = [
    'Opening Image',
    'Theme Stated',
    'Setup',
    'Catalyst',
    'Debate',
    'Break Into Two',
    'B Story',
    'Fun and Games',
    'Midpoint',
    'Bad Guys Close In',
    'All is Lost',
    'Dark Night of the Soul',
    'Break Into Three',
    'Finale',
    'Final Image',
  ];
  const [ideation, setIdea] = useState([]);
  const [pre, setPre] = useState([]);
  const [post, setPost] = useState([]);

  const fetchHomeList = async () => {
    const res = await getHome();
    if (res && res.data && res.data.ideation) {
      const { ideation, pre, post } = res.data;
      setIdea(ideation);
      setPre(pre);
      setPost(post);
    }
  };

  const initialFire = async (message) => {
    setCurrent('title');

    let template = `Write title, character profiles for a ${contentType} on ${genre} with temporality as ${temporality}. ${
      !!message ? `The synopsis is ${message}.` : ''
    } Also give the outline for this story using the Save the cat story structure.`;
    let reply = await askGPT(template);
    if (reply.trim() === '') {
      errorHandler('Script limit exceeded, buy more to continue');
    }
    setMessages((prev) => [
      ...prev,
      {
        message: reply,
        direction: 'incoming',
        mbold: 'Title, character profiles and outline',
        image: logo,
        time: new Date(),
      },
    ]);
    let script = await askGPTRecursive(
      0,
      // template + '\n' +
      reply,
      reply.split('\n')[0]
    );
    setFinalScript(script);
    setGenerating(true);
  };

  const askGPTRecursive = async (index, currentTemplate, currScript) => {
    setCurrent(topics[index]);
    if (index >= topics.length) {
      await fetchPendingScripts();
      return currScript;
    }
    let isLast = false;
    if (index === topics.length - 1) {
      isLast = true;
    }
    //let temp = currentTemplate;
    let tempScript = currScript;
    //temp += `\nWrite ${topics[index]} in a screenplay format.`;
    let r = await askGPT(
      currentTemplate +
        `\nWrite ${topics[index]} in a screenplay format. The length should be atleast one page`,
      isLast
    );
    if (!!r) {
      tempScript += '\n' + r;
      if (!index) {
        setMessages((prev) => [
          ...prev,
          {
            message: r,
            direction: 'incoming',
            mbold: topics[index],
            image: logo,
            time: new Date(),
          },
        ]);
      } else {
        // setMessages((prev) => {
        //     const updatedArray = [...prev];
        //     const lastObjectIndex = updatedArray.length - 1;
        //     updatedArray[lastObjectIndex] = { ...updatedArray[lastObjectIndex], message: updatedArray[lastObjectIndex].message + r }
        //     return updatedArray
        // })
        setMessages((prev) => [
          ...prev,
          {
            message: r,
            direction: 'incoming',
            mbold: topics[index],
            image: logo,
            time: new Date(),
          },
        ]);
      }
    }

    return await askGPTRecursive(index + 1, currentTemplate, tempScript);
  };

  const handleOptionClick = (question, option) => {
    switch (question) {
      case 'Content type ?':
        setContentType(option);
        setMessages([
          ...messages,
          {
            message: `Content type?`,
            direction: 'incoming',
            mbold: null,
            image: logo,
            time: new Date(),
          },
          {
            message: `${option}`,
            direction: 'outgoing',
            mbold: null,
            image: user ? user.profileImage : userImg,
            time: new Date(),
          },
        ]);
        break;
      case 'Genre ?':
        setGenre(option);
        setMessages([
          ...messages,
          {
            message: `Genre?`,
            direction: 'incoming',
            mbold: null,
            image: logo,
            time: new Date(),
          },
          {
            message: `${option}`,
            direction: 'outgoing',
            mbold: null,
            image: user ? user.profileImage : userImg,
            time: new Date(),
          },
        ]);
        break;
      case 'Temporality ?':
        setTemporality(option);
        setMessages([
          ...messages,
          {
            message: `Temporality ?`,
            direction: 'incoming',
            mbold: null,
            image: logo,
            time: new Date(),
          },
          {
            message: `${option}`,
            direction: 'outgoing',
            mbold: null,
            image: user ? user.profileImage : userImg,
            time: new Date(),
          },
        ]);
        break;
      case 'Do you have a one minute pitch idea in short ?':
        // setHasPitchIdea(option);
        option === 'YES' ? setEnableTF(true) : setHasPitchIdea(false);
        option === 'Search on web' &&
          window.open(
            `https://www.google.com/search?q=Ideas for a ${contentType} with genre ${genre} and temporality as ${temporality}`,
            '_blank'
          );
        option === 'Search on web' ? setEnableTF(true) : setHasPitchIdea(false);
        option === 'NO' && setDisableTF(true);
        option === 'NO' &&
          setMessages((prev) => [
            ...prev,
            {
              message: `Do you have a one minute pitch idea in short ?`,
              direction: 'incoming',
              mbold: null,
              image: logo,
              time: new Date(),
            },
            {
              message: `${option}`,
              direction: 'outgoing',
              mbold: null,
              image: user ? user.profileImage : userImg,
              time: new Date(),
            },
          ]);
        // option === "NO" && initialFire(false);
        option === 'NO' && onHandleOptions();
        break;
      case 'Select Idea':
        // initialFire(option);
        onShotIDeas(option);
        break;
      case 'Select Synopsis':
        // initialFire(option);
        onShotSynopsis(option);
        break;
      default:
        break;
    }
  };

  const onShotIDeas = (option) => {
    setMsgInputValue(option);
    setIdeasType(false);
    setEnableTF(true);
    setDisableTF(false);
    setHasPitchIdea(false);
  };

  const onShotSynopsis = (option) => {
    setMsgInputValue(option);
    setSynopsisType(false);
    setEnableTF(true);
    setDisableTF(false);
  };

  async function onHandleOptions() {
    setCurrent('Ideas');

    let template = `Write three ideas of one minute pitch for a ${contentType} on ${genre} with temporality as ${temporality}.`;
    let reply = await askGPT(template);
    if (reply.trim() === '') {
      errorHandler('Script limit exceeded, buy more to continue');
    }
    const splits = reply
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== '');

    setMessages((prev) => [
      ...prev,
      {
        message: reply,
        direction: 'incoming',
        mbold: 'Ideas of one Minute Pitch',
        image: logo,
        time: new Date(),
      },
    ]);
    setGenerating(false);
    setIdeasType(true);
    setShowIdeas(splits.slice(0, 3));
    setCurrent('');
    // setEnableTF(false);
    // setDisableTF(false);
  }

  async function onHandleSynopsisOptions(message) {
    setCurrent('Synopsis');

    let template = `Write three synopsis of the one minute pitch ${message} for a ${contentType} on ${genre} with temporality as ${temporality}.`;
    let reply = await askGPT(template);
    if (reply.trim() === '') {
      errorHandler('Script limit exceeded, buy more to continue');
    }
    const splits = reply
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== '');

    setMessages((prev) => [
      ...prev,
      {
        message: reply,
        direction: 'incoming',
        mbold: 'Synopsis',
        image: logo,
        time: new Date(),
      },
    ]);
    setGenerating(false);
    setSynopsisType(true);
    setShowSynopsis(splits.slice(0, 3));
    setCurrent('');
    // setEnableTF(false);
    // setDisableTF(false);
  }

  const renderOptions = (question) => {
    let options;
    if (question == 'Genre ?') {
      options = OptionMap[question].options[contentType];
    } else {
      options = OptionMap[question].options;
    }

    return (
      <div>
        {!account && (
          <p style={{ fontSize: '12px', margin: '0', fontWeight: 'bold' }}>
            Please SignIn/SignUp to use the script generation service
          </p>
        )}
        {account && pendingScripts < 1 && (
          <p style={{ fontSize: '12px', margin: '0', fontWeight: 'bold' }}>
            Please purchase scripts to use the script generation service
          </p>
        )}
        <p style={{ fontSize: '12px', margin: '0', fontWeight: 'bold' }}>
          {question}
        </p>
        {options.map((option, index) => (
          <Button
            key={index}
            sx={{ ...btn, marginRight: '10px', marginBottom: '10px' }}
            onClick={() => handleOptionClick(question, option)}
            disabled={!account || pendingScripts < 1}
          >
            {option}
          </Button>
        ))}
      </div>
    );
  };

  const renderIdeasOptions = (question) => {
    return (
      <div className='d-grid align-items-center mb-3'>
        <p className='fw-bold mb-1'>{question}</p>
        <div className='d-flex align-items-center gap-2'>
          {showIdeas.map((option, index) => (
            <Button
              key={index}
              sx={{ ...btn, marginRight: '10px', marginBottom: '10px' }}
              onClick={() => handleOptionClick(question, option)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const renderSynopsisOptions = (question) => {
    return (
      <div className='d-grid align-items-center mb-3'>
        <p className='fw-bold mb-1'>{question}</p>
        <div className='d-flex align-items-center gap-2'>
          {showSynopsis.map((option, index) => (
            <Button
              key={index}
              sx={{ ...btn, marginRight: '10px', marginBottom: '10px' }}
              onClick={() => handleOptionClick(question, option)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const handleSend = (message) => {
    setMessages([
      ...messages,
      {
        message: `${message}`,
        direction: 'outgoing',
        mbold: null,
        image: user ? user.profileImage : userImg,
        time: new Date(),
      },
    ]);
    if (showSynopsis && showSynopsis.length === 0) {
      setHasPitchIdea(message);
    }
    setMsgInputValue('');
    setEnableTF(false);

    setDisableTF(true);
    if (showSynopsis && showSynopsis.length > 0) {
      initialFire(message);
    } else {
      onHandleSynopsisOptions(message);
    }
    inputRef.current.focus();
  };

  const saveAndDownload = async () => {
    setDownload(true);
    let options = {
      paginate: true,
      tokens: true,
    };

    const screenplay = FountainParser.parse(finalScript, options);

    let html =
      screenplay.title_page_html +
      screenplay.script_pages.map((i) => i.html).join('');
    const opt = {
      margin: 1,
      filename: `Script_${shorthash.unique(html)}`,
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };
    await html2pdf(html, opt);
    setDownload(false);
  };

  const save = async () => {
    setSaveLoad(true);
    let options = {
      paginate: true,
      tokens: true,
    };

    const screenplay = FountainParser.parse(finalScript, options);

    let html =
      screenplay.title_page_html +
      screenplay.script_pages.map((i) => i.html).join('');
    const opt = {
      margin: 1,
      filename: `Script_${shorthash.unique(html)}`,
      jsPDF: {
        unit: 'in',
        format: 'letter',
        orientation: 'portrait',
        compress: 'true',
        floatPrecision: 18,
      },
    };

    try {
      const pdfBlob = await html2pdf().set(opt).from(html).output('blob');
      const pdfFile = new File(
        [pdfBlob],
        `Script_${shorthash.unique(html)}.pdf`,
        { type: 'application/pdf' }
      );

      let form2Data = new FormData();
      form2Data.append('files', pdfFile, pdfFile.name);

      // Uncomment the following lines to proceed with uploading FormData
      let res = await uploadImg(form2Data);
      let res2 = await updateMe({
        scripts: [...user?.scripts, res.data.urls[0]],
      });
      localStorage.setItem('ybUser', JSON.stringify(res2.data));
      setUser(res2.data);
      setSaveLoad(false);
      successHandler('Script saved successfully');
    } catch (error) {
      setSaveLoad(false);
      if (!user) {
        errorHandler('Login to save the script');
      } else {
        errorHandler('Error generating or uploading PDF');
      }
    }
  };

  useEffect(() => {
    fetchPendingScripts();
    fetchHomeList();
  }, [open2, finalScript]);

  return (
    <>
      <div
        style={{
          height: '76vh',
        }}
      >
        <ChatContainer>
          <MessageList
            style={{ paddingBottom: '3%' }}
            scrollBehavior='smooth'
            typingIndicator={
              current && (
                <TypingIndicator
                  style={{ backgroundColor: 'transparent' }}
                  content={`Generating ${current}`}
                />
              )
            }
          >
            {messages.length === 0 ? (
              <div
                className='chat-mycont'
                style={{
                  ...df_jc_ac,
                  height: '100%',
                  gap: '6%',
                  padding: '0 10%',
                }}
              >
                <Grid container spacing={{ md: 3, xs: 0 }}>
                  <Grid
                    item
                    md={4}
                    sx={{ ...df_jc_ac_fdc, marginTop: { md: '0', xs: '15%' } }}
                  >
                    <Icon icon='eva:bulb-outline' />
                    <h5 style={bold_name}>Ideation</h5>
                    {ideation.map((id, index) => (
                      <div
                        style={{
                          marginTop: '5%',
                          backgroundColor: 'white',
                          borderRadius: '10px',
                          padding: '2%',
                          width: '100%',
                        }}
                        key={index}
                      >
                        <p
                          style={{
                            ...ptag,
                            textAlign: 'center',
                            padding: '2%',
                            borderRadius: '10px',
                          }}
                        >
                          {id}
                        </p>
                      </div>
                    ))}
                  </Grid>
                  <Grid
                    item
                    md={4}
                    sx={{ ...df_jc_ac_fdc, marginTop: { md: '0', xs: '15%' } }}
                  >
                    <Icon icon='mdi:movie-edit' />
                    <h5 style={bold_name}>Pre-Production</h5>
                    {pre.map((id, index) => (
                      <div
                        style={{
                          marginTop: '5%',
                          backgroundColor: 'white',
                          borderRadius: '10px',
                          padding: '2%',
                          width: '100%',
                        }}
                        key={index}
                      >
                        <p
                          style={{
                            ...ptag,
                            textAlign: 'center',
                            padding: '2%',
                            borderRadius: '10px',
                          }}
                        >
                          {id}
                        </p>
                      </div>
                    ))}
                  </Grid>
                  <Grid
                    item
                    md={4}
                    sx={{ ...df_jc_ac_fdc, marginTop: { md: '0', xs: '15%' } }}
                  >
                    <Icon icon='ri:movie-2-line' />
                    <h5 style={bold_name}>Post-Production & Distribution</h5>
                    {post.map((id, index) => (
                      <div
                        style={{
                          marginTop: '5%',
                          backgroundColor: 'white',
                          borderRadius: '10px',
                          padding: '2%',
                          width: '100%',
                        }}
                        key={index}
                      >
                        <p
                          style={{
                            ...ptag,
                            textAlign: 'center',
                            padding: '2%',
                            borderRadius: '10px',
                          }}
                        >
                          {id}
                        </p>
                      </div>
                    ))}
                  </Grid>
                </Grid>
              </div>
            ) : (
              messages.map((m, i) => (
                <div style={{ display: 'flex' }}>
                  {m.direction === 'incoming' && (
                    <Avatar
                      src={m.image}
                      style={{
                        width: '30px',
                        height: '30px',
                        marginRight: '1%',
                        marginTop: '2%',
                      }}
                    />
                  )}
                  <Message key={i} model={m}>
                    <Message.CustomContent>
                      {m.mbold && <strong>{m.mbold}</strong>}
                      {m.mbold && <br />}
                      {m.message}
                      {m.direction === 'outgoing' ? (
                        <p
                          style={{
                            textAlign: 'right',
                            ...ptag,
                            fontSize: '8px',
                          }}
                        >
                          {moment(m.time).format('hh:mm A')}
                        </p>
                      ) : (
                        <p
                          style={{
                            textAlign: 'left',
                            ...ptag,
                            fontSize: '8px',
                          }}
                        >
                          {moment(m.time).format('hh:mm A')}
                        </p>
                      )}
                    </Message.CustomContent>
                  </Message>
                  {m.direction === 'outgoing' && (
                    <Avatar
                      src={m.image}
                      style={{
                        width: '30px',
                        height: '30px',
                        marginLeft: '1%',
                        marginTop: '2%',
                      }}
                    />
                  )}
                </div>
              ))
            )}
          </MessageList>
        </ChatContainer>
        <div>
          {contentType === null && renderOptions('Content type ?')}
          {contentType && genre === null && renderOptions('Genre ?')}
          {contentType &&
            genre &&
            temporality === null &&
            renderOptions('Temporality ?')}
          {contentType &&
            genre &&
            temporality &&
            !enableTF &&
            hasPitchIdea === null &&
            renderOptions('Do you have a one minute pitch idea in short ?')}
          {ideasType && renderIdeasOptions('Select Idea')}
          {synopsisType && renderSynopsisOptions('Select Synopsis')}
        </div>
        {generating && (
          <>
            {download ? (
              <Button
                sx={{
                  marginRight: '10px',
                  marginBottom: '10px',
                  cursor: 'default',
                }}
              >
                <CircularProgress size={30} sx={circularprog} />{' '}
              </Button>
            ) : (
              <Button
                sx={{ ...btn, marginRight: '10px', marginBottom: '10px' }}
                onClick={() => saveAndDownload()}
              >
                Download
              </Button>
            )}
            {saveLoad ? (
              <Button
                sx={{
                  marginRight: '10px',
                  marginBottom: '10px',
                  cursor: 'default',
                }}
              >
                <CircularProgress size={30} sx={circularprog} />{' '}
              </Button>
            ) : (
              <Button
                sx={{ ...btn, marginRight: '10px', marginBottom: '10px' }}
                onClick={() => save()}
              >
                Save
              </Button>
            )}
            <Button
              sx={{ ...btn, marginRight: '10px', marginBottom: '10px' }}
              onClick={async () => {
                await fetchPendingScripts();
                setGenerating(false);
                setContentType(null);
                setGenre(null);
                setTemporality(null);
                setHasPitchIdea(null);
              }}
            >
              Regenerate Script
            </Button>
          </>
        )}
        {(enableTF || disableTF) && !generating && (
          <MessageInput
            placeholder='Something on your mind'
            disabled={disableTF}
            onSend={handleSend}
            onChange={setMsgInputValue}
            value={msgInputValue}
            ref={inputRef}
          />
        )}
      </div>
    </>
  );
}
