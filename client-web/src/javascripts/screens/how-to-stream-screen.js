import React, { useEffect } from 'react'
import moment from 'moment'

import { useStream } from 'context/stream'

const HowToStreamScreen = () => {
  const { publishStreamUrl, publishStreamKey, expires, getStreamData } = useStream()

  const copyData = (data) => {
    window.navigator.clipboard.writeText(data)
  }

  useEffect(() => {
    getStreamData(true)
  }, [])

  return (
    <div className="page how-to-stream-page">
      <div className="page-scrolling-content">
        <div className="how-to-stream-content">
          <h2 className="underline">What Is This?</h2>
          <p>Minnecrapolis Live is a live streaming platform maintained by members of the <a href="https://minnecrapol.is" target="_blank">Minnecrapolis Slack</a>. The platform uses RTMP to accept an incoming stream of video and encodes the video to be consumed by viewers as an HLS playlist. There is only one stream and only one member can be streaming at any time, therefore users are granted separate stream keys to authenticate them when streaming.</p>
          <p>If you already know how to publish a stream to an RTMP server, then use the server URL and stream key below to do your business. A suggested streaming workflow is provided for the less experienced.</p>
          <br />

          <h2 className="underline">Your Streaming Info</h2>
          <div className="stream-data">
            <div className="stream-data-header">
              <h3>Server URL</h3>
            </div>
            <div className="copy-code">
              <p>{ publishStreamUrl }</p>
              <a onClick={ () => copyData(publishStreamUrl) }>Copy</a>
            </div>
          </div>
          <div className="stream-data">
            <div className="stream-data-header">
              <h3>Your Stream Key</h3>
              <p>Expires { moment().to(expires) }</p>
            </div>
            <div className="copy-code">
              <p>{ publishStreamKey }</p>
              <a onClick={ () => copyData(publishStreamKey) }>Copy</a>
            </div>
          </div>
          <a onClick={ () => getStreamData(true, true) }>Generate New Key</a>
          <br />
          <br />
          <br />

          <h2 className="underline">Suggested Streaming Workflow</h2>
          <p>
            For those new to streaming, we recommend Open Broadcaster Software (OBS) to stream from a computer to our platform.
            The instructions that follow are primarially focused on helping get the audio playing on your computer to stream to our
            platform, while still being able to hear the audio on your computer. Which, specifically on Mac, is more annoying that it sounds.
          </p>
          <h4 className="underline">1. Install BlackHole</h4>
          <p>
            BlackHole is a virtual audio device for macOS. It allows you to route audio between applications on your computer. We'll
            use it to route all the audio playing on the system into OBS so it can be streamed to our platform.
          </p>
          <p>Download BlackHole from <a href="https://existential.audio/blackhole" target="_blank">https://existential.audio/blackhole</a> and run the installer to install it. We'll come back to this in a later step.</p>

          <h4 className="underline">2. Install Open Broadcaster Software</h4>
          <p>
            Open Broadcaster Software (OBS) is an open source live streaming application for macOS, Windows and Linux. This application
            will handle connecting to our server and streaming your audio and/or video so others can tune in and watch it live.  
          </p>
          <p>Download OBS from <a href="https://obsproject.com" target="_blank">https://obsproject.com</a> and run the installer to install it.</p>

          <h4 className="underline">3. Configure OBS Audio Settings</h4>
          <p>
            3A. Open OBS and click the 'Settings' button in the lower right corner. Then click the 'Audio' tab in the settings window that opens.
            In the section labeled 'Devices', change the option labeled 'Mic/Auxiliary Audio' to the item in the list labeled 'BlackHole 16ch'.
            (If you don't see 'BlackHole 16ch' as an option here, you either skipped step 1 or royally fucked it up.) This tells OBS to capture
            and stream any audio coming out of the BlackHole virutal audio device you installed in step 1. If you want to also use a microphone
            while you are streaming, you can chose your microphone device for the next option, the one labeled 'Mic/Auxiliary Audio 2'.
          </p>
          <p>
            3B. Still in the 'Audio' tab in the settings window, scroll down to the section labeled 'Advanced'. Change the option labeled 'Monitoring Device'
            to the item in the list that you want the audio to come out of so you can hear it. This will likely be labeled something like 'MacBook Pro Speakers'
            or 'Built-in Output'. IMPORTANT - DO NOT select the item labeled 'Default' for this option, select the specific item that you want sound to come out of so you can hear it.
          </p>
          <p>
            Click the button labeled 'OK' to close the settings window. Verify you have a 2-channel meter labeled 'Mic/Aux' in the panel labeled 'Audio Mixer' in the bottom center of the main OBS window.
            You may also have another meter labeled 'Mic/Aux 2' in the case you also selected a microphone device.
          </p>
          <p>
            3C. At this point OBS can capture the audio coming out of the BlackHole virtual audio device and stream it to our platform. In order to hear the
            audio out of your computer speakers however, we need to setup 'monitoring'. Just under the 2-channel meter labeled 'Mic/Aux', click the gear/cog
            icon and select 'Advanced Audio Properties' from the menu that opens. A new window will open with some options for the audio device(s) you setup
            in step 3A. Find the option in the column labeled 'Audio Monitoring' for the device with name 'Mic/Aux' and set it to 'Monitor and Output'. This
            tells OBS that we want to monitor the audio for this track out of the device we configured in step 3B AND ALSO output it to the stream.
          </p>

          <h4 className="underline">4. Configure macOS Sound Output Device</h4>
          <p>
            Right now, OBS is setup to capture and stream audio from BlackHole to our platform, but we're still not sending any audio to BlackHole... To do that,
            open System Preferences on your Mac and click the speaker icon labeled 'Sound'. Click the 'Output' tab and select the device named 'BlackHole 16ch'.
            By doing this, you're telling macOS to send all the sound coming from your computer to BlackHole instead of the speakers. OBS is capturing the audio from BlackHole,
            adding it to your media stream, and sending it out of the monitoring device you selected in step 3B, which is almost certainly your speakers! Loop complete!
          </p>
          <p>If you play some audio on your computer (iTunes, Spotify, doesn't matter), you should be able hear it and also see the meter in OBS jump around with the audio levels. It's working!</p>
          <p>TIP - OBS will now capture ALL of your system audio, including Slack notifications, iMessage chimes and the paper sound when you empty your trash. Do what you need to do to limit those during your stream, or send 'em though, it's up to you boss.</p>

          <h4 className="underline">5. Add An Image To Your Stream</h4>
          <p>
            Back in OBS, find the panel labeled 'Sources' along the bottom of the main window. Click the '+' button at the bottom of the panel and select 'Image' from the menu that opens.
            Make sure 'Create new' radio is selected and click 'OK'. Use the 'Browse' button to the right of the 'Image File' field to select an image to add to your stream.
            Click 'OK' to close the window. You should see your image added to the canvas. You can drag it around and use the red handles along the edges to resize it.
          </p>

          <h4 className="underline">6. Start Streaming!</h4>
          <p>
            Our stream in OBS now has an image and is capturing all the audio playing on the computer. Now it's time to stream this media to our platform so others can view it!
            Click the button labeled 'Settings' in the bottom right corner of the main OBS window. Click the tab labeled 'Stream' in the window that opens. For the option labeled 'Service',
            select the item labeled 'Custom...'. Copy the 'Server URL' value that is above these instructions and paste it into the field labeled 'Server'.
            Copy the 'Your Stream Key' value that is above these instructions and paste it into the field labeled 'Stream Key'. Click 'OK' to save these settings.
          </p>
          <p>
            Everything is set to start streaming, so click that button labeled 'Start Streaming' in the lower right of the main OBS window. The button should change to ready 'Stop Streming'
            and you should have a colored square in the very bottom right corner of the OBS window. This square will change colors with the quality of your stream, green is good red is bad.
          </p>
          <p>
            If OBS hangs for 15-30 seconds and then returns an error that it couldn't reach the server, there is likely someone else already streaming. If you get an error right away that the
            server can't be reached, check the values of the 'Server' and 'Stream Key' fields in the 'Stream' tab of the settings window in OBS. Otherwise, the server is probably broken and that's
            always Max's fault.
          </p>

          <h4 className="underline">What Else?</h4>
          <p>
            OBS is pretty sweet - you can add video files, play a slideshow or capture from a webcam to add to your stream. You could also just set a background color and add some text, it's your stream!
            Play around with the 'Sources' panel to add more fun media to your stream.
          </p>
          <p>
            IMPORTANT - When you are done streaming, make sure you change the 'Output' device in the 'Sound' panel of System Preferences back to your built-in speakers or output.
            If you close OBS, you will not be able to hear your system audio until you do this! 
          </p>
        </div>
      </div>
    </div>
  )
}

export default HowToStreamScreen