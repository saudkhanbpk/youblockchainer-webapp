import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Avatar, Button, CircularProgress } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import OptionMap from './OptionMap.json';
import { askGPT } from '../../services/ChatApi';
import { btn, circularprog, ptag } from '../../theme/CssMy';
import moment from 'moment-timezone';
import userImg from '../../images/user.png'
import logo from '../../images/chatbot.png'
import { FountainParser } from "screenplay-js";
import jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js'
import { updateMe } from '../../services/userServices';
import { uploadImg, uploadPics } from '../../services/ipfsServicesApi';
import shorthash from 'shorthash';
import { useNavigate } from 'react-router';
import { PDFDocument, PDFCompressionQuality } from 'pdf-lib';
import { ybcontext } from '../../context/MainContext';


export default function Chat2() {
    const inputRef = useRef();
    const user = JSON.parse(localStorage.getItem('ybUser'))
    const { setUser } = useContext(ybcontext)
    const [msgInputValue, setMsgInputValue] = useState("");
    const [messages, setMessages] = useState([]);
    const [contentType, setContentType] = useState(null);
    const [genre, setGenre] = useState(null);
    const [temporality, setTemporality] = useState(null);
    const [hasPitchIdea, setHasPitchIdea] = useState(null);
    const [enableTF, setEnableTF] = useState(false)
    const [disableTF, setDisableTF] = useState(false)
    const [current, setCurrent] = useState(undefined)
    const [finalScript, setFinalScript] = useState('')
    const [saveLoad, setSaveLoad] = useState(false)
    const [download, setDownload] = useState(false)
    const navigate = useNavigate()
    const [generating, setGenerating] = useState(false)
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

    const initialFire = async (message) => {
        setCurrent('title')

        let template = `Write title, character profiles for a ${contentType} ${genre
            } with temporality as ${temporality}. ${!!message ? `The idea is ${message}.` : ''
            } Also give the outline for this story using the Save the cat story structure.`;
        console.log(template)
        let reply = await askGPT(template);
        console.log(reply);
        setMessages((prev) => [...prev, {
            message: reply,
            direction: 'incoming',
            mbold: 'Title, character profiles and outline',
            image: logo,
            time: new Date()
        }])
        let script = await askGPTRecursive(
            0,
            // template + '\n' +
            reply,
            reply.split('\n')[0],
        );
        setFinalScript(script)
        console.log(script)
        setGenerating(true)
    }

    const askGPTRecursive = async (index, currentTemplate, currScript) => {


        setCurrent(topics[index])
        if (index >= topics.length) {
            return currScript;
        }
        //let temp = currentTemplate;
        let tempScript = currScript;
        //temp += `\nWrite ${topics[index]} in a screenplay format.`;
        let r = await askGPT(
            currentTemplate +
            `\nWrite ${topics[index]} in a screenplay format. The length should be atleast one page`,
        );
        if (!!r) {
            tempScript += '\n' + r;
            console.log(r)
            if (!index) {
                setMessages((prev) => [...prev, {
                    message: r,
                    direction: 'incoming',
                    mbold: topics[index],
                    image: logo,
                    time: new Date()
                }]);
            } else {
                // setMessages((prev) => {
                //     const updatedArray = [...prev];
                //     const lastObjectIndex = updatedArray.length - 1;
                //     updatedArray[lastObjectIndex] = { ...updatedArray[lastObjectIndex], message: updatedArray[lastObjectIndex].message + r }
                //     return updatedArray
                // })
                setMessages((prev) => [...prev, {
                    message: r,
                    direction: 'incoming',
                    mbold: topics[index],
                    image: logo,
                    time: new Date()
                }]);
            }
        }

        return await askGPTRecursive(index + 1, currentTemplate, tempScript);

    };
    console.log(user)

    const handleOptionClick = (question, option) => {
        switch (question) {
            case 'Content type ?':
                setContentType(option);
                setMessages([...messages, {
                    message: `Content type?`,
                    direction: 'incoming',
                    mbold: null,
                    image: logo,
                    time: new Date()
                }, {
                    message: `${option}`,
                    direction: 'outgoing',
                    mbold: null,
                    image: user ? user.profileImage : userImg,
                    time: new Date()
                }]);
                break;
            case 'Genre ?':
                setGenre(option);
                setMessages([...messages, {
                    message: `Genre?`,
                    direction: 'incoming',
                    mbold: null,
                    image: logo,
                    time: new Date()
                }, {
                    message: `${option}`,
                    direction: 'outgoing',
                    mbold: null,
                    image: user ? user.profileImage : userImg,
                    time: new Date()
                }]);
                break;
            case 'Temporality ?':
                setTemporality(option);
                setMessages([...messages, {
                    message: `Temporality ?`,
                    direction: 'incoming',
                    mbold: null,
                    image: logo,
                    time: new Date()
                }, {
                    message: `${option}`,
                    direction: 'outgoing',
                    mbold: null,
                    image: user ? user.profileImage : userImg,
                    time: new Date()
                }]);
                break;
            case 'Do you have a one minute pitch idea in short ?':
                // setHasPitchIdea(option);
                option === "YES" ? setEnableTF(true) : setHasPitchIdea(false)
                option === "Search on web" && window.open('http://myreeldream.ai/', '_blank')

                option === "NO" && setDisableTF(true)
                option === "NO" && setMessages((prev) => [...prev, {
                    message: `Do you have a one minute pitch idea in short ?`,
                    direction: 'incoming',
                    mbold: null,
                    image: logo,
                    time: new Date()
                }, {
                    message: `${option}`,
                    direction: 'outgoing',
                    mbold: null,
                    image: user ? user.profileImage : userImg,
                    time: new Date()
                }]
                );
                option === "NO" && initialFire(false)
                break;
            default:
                break;
        }
    };

    const renderOptions = (question) => {
        const options = OptionMap[question].options;
        return (
            <div>
                <p style={{ fontSize: '12px', margin: '0', fontWeight: 'bold' }}>{question}</p>
                {options.map((option, index) => (
                    <Button key={index} sx={{ ...btn, marginRight: '10px', marginBottom: '10px' }} onClick={() => handleOptionClick(question, option)}>
                        {option}
                    </Button>
                ))}
            </div>
        );
    };

    console.log(current)


    const handleSend = message => {
        setMessages([...messages, {
            message: `Idea`,
            direction: 'incoming',
            mbold: null,
            image: logo,
            time: new Date()
        }, {
            message: `${message}`,
            direction: 'outgoing',
            mbold: null,
            image: user ? user.profileImage : userImg,
            time: new Date()
        }]);
        setHasPitchIdea(message)
        setMsgInputValue("");
        setEnableTF(false)

        setDisableTF(true)
        initialFire(message)
        inputRef.current.focus();
    };

    const saveAndDownload = async () => {
        setDownload(true)
        console.log('here', FountainParser);
        let options = {
            paginate: true,
            tokens: true,
        };

        const screenplay = FountainParser.parse(
            finalScript,
            options,
        );
        console.log(screenplay)


        let html =
            screenplay.title_page_html +
            screenplay.script_pages.map(i => i.html).join('');
        const opt = {
            margin: 1,
            filename: `Script_${shorthash.unique(html)}`,
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        await html2pdf(html, opt)
        setDownload(false)
    }

    const save = async () => {
        setSaveLoad(true)
        console.log('here', FountainParser);
        let options = {
            paginate: true,
            tokens: true,
        };

        const screenplay = FountainParser.parse(
            finalScript,
            options,
        );
        console.log(screenplay)

        let html =
            screenplay.title_page_html +
            screenplay.script_pages.map(i => i.html).join('');
        const opt = {
            margin: 1,
            filename: `Script_${shorthash.unique(html)}`,
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait', compress: 'true', floatPrecision: 18 }
        };

        try {
            const pdfBlob = await html2pdf().set(opt).from(html).output('blob');
            console.log(pdfBlob);
            const pdfFile = new File([pdfBlob], `Script_${shorthash.unique(html)}.pdf`, { type: 'application/pdf' });
            console.log(pdfFile);

            let form2Data = new FormData();
            form2Data.append('files', pdfFile, pdfFile.name);
            console.log(form2Data);

            // Uncomment the following lines to proceed with uploading FormData
            let res = await uploadImg(form2Data);
            console.log('---Uploaded PDF', res.data.urls);
            let res2 = await updateMe({ scripts: [...user?.scripts, res.data.urls[0]] })
            localStorage.setItem('ybUser', JSON.stringify(res2.data))
            setUser(res2.data)
            setSaveLoad(false)
        } catch (error) {
            console.error('Error generating or uploading PDF:', error);
        }
    }

    console.log(Object.keys(OptionMap))

    return <>
        <div style={{
            height: "76vh",
        }}>
            <ChatContainer >
                <MessageList style={{ paddingBottom: '3%' }} scrollBehavior="smooth" typingIndicator={current && <TypingIndicator style={{ backgroundColor: 'transparent' }} content={`Generating ${current}`} />} >
                    {messages.map((m, i) => <div style={{ display: 'flex' }}>
                        {m.direction === 'incoming' && <Avatar src={m.image} style={{ width: '30px', height: '30px', marginRight: '1%', marginTop: '2%' }} />}
                        <Message key={i} model={m}  >
                            <Message.CustomContent >
                                {m.mbold && <strong>{m.mbold}</strong>}
                                {m.mbold && <br />}
                                {m.message}
                                {m.direction === 'outgoing' ? <p style={{ textAlign: 'right', ...ptag, fontSize: '8px' }}>{moment(m.time).format('hh:mm A')}</p> : <p style={{ textAlign: 'left', ...ptag, fontSize: '8px' }}>{moment(m.time).format('hh:mm A')}</p>}
                            </Message.CustomContent>
                        </Message>
                        {m.direction === 'outgoing' && <Avatar src={m.image} style={{ width: '30px', height: '30px', marginLeft: '1%', marginTop: '2%' }} />}
                    </div>)}
                </MessageList>
            </ChatContainer>
            <div>
                {contentType === null && renderOptions('Content type ?')}
                {contentType && genre === null && renderOptions('Genre ?')}
                {contentType && genre && temporality === null && renderOptions('Temporality ?')}
                {contentType && genre && temporality && !enableTF && hasPitchIdea === null && renderOptions('Do you have a one minute pitch idea in short ?')}
            </div>
            {
                generating && <>
                    {download ? <Button sx={{ marginRight: '10px', marginBottom: '10px', cursor: 'default' }}><CircularProgress size={30} sx={circularprog} /> </Button> :
                        <Button sx={{ ...btn, marginRight: '10px', marginBottom: '10px' }} onClick={() => saveAndDownload()}>
                            Download
                        </Button>}
                    {saveLoad ? <Button sx={{ marginRight: '10px', marginBottom: '10px', cursor: 'default' }}><CircularProgress size={30} sx={circularprog} /> </Button>
                        : <Button sx={{ ...btn, marginRight: '10px', marginBottom: '10px' }} onClick={() => save()}>
                            Save
                        </Button>}
                    <Button sx={{ ...btn, marginRight: '10px', marginBottom: '10px' }} onClick={() => {
                        setGenerating(false)
                        setContentType(null)
                        setGenre(null)
                        setTemporality(null)
                        setHasPitchIdea(null)
                    }}>
                        Regenerate Script
                    </Button>
                </>

            }
            {(enableTF || disableTF) && !generating && <MessageInput placeholder="Something on your mind" disabled={disableTF} onSend={handleSend} onChange={setMsgInputValue} value={msgInputValue} ref={inputRef} />}
        </div>
    </>
}

