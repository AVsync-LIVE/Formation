import { Box, Button, Gap, NumberSlider } from '../../internal'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

interface TrackData {
  id: string,
  name: string,
  originalFrames: number,
  rate: number,
  offset: number,
  in: number,
  out: number
}

interface TrackProps {
  width: number,
  offset: number,
  trackData: TrackData,
  onTrackChange: (newTrackData: TrackData) => void
}

interface MouseEventReact extends React.MouseEvent {
  clientX: number,
}

interface InitialValue {
  in: number,
  out: number,
  offset: number
}

export const Track = ({ trackData, width, offset, onTrackChange }: TrackProps) => {
  const [isDragging, setIsDragging] = useState<'in' | 'out' | 'offset' | null>(null)
  const [initialMouseX, setInitialMouseX] = useState<number | null>(null)
  const [initialValue, setInitialValue] = useState<InitialValue>({ in: 0, out: 0, offset: 0 })
  const trackRef = useRef<HTMLDivElement>(null)

  const onMouseDown = (event: MouseEventReact, which: 'in' | 'out' | 'offset') => {
    setIsDragging(which)
    setInitialMouseX(event.clientX)
    setInitialValue({ in: trackData.in, out: trackData.out, offset: trackData.offset })
  }

  const onMouseUp = () => {
    setIsDragging(null)
  }

  const onMouseMove = (event: MouseEventReact) => {
    if (isDragging && trackRef.current) {
      const actualWidth = trackRef.current.clientWidth
      const totalWidth = trackData.out - trackData.in // Removed the offset from the total width
      const scale = actualWidth / totalWidth
  
      let delta = (event.clientX - (initialMouseX || 0)) / scale
      delta = Math.round(delta)
  
      let updatedTrack = { ...trackData }
  
      switch (isDragging) {
        case 'in': {
          updatedTrack.in = Math.min(
            Math.max(0, initialValue.in + delta),
            updatedTrack.out
          )
          updatedTrack.offset = Math.max(0, initialValue.offset + delta)
          break
        }
        case 'out': {
          updatedTrack.out = Math.max(
            Math.min(initialValue.out + delta, trackData.originalFrames),
            updatedTrack.in
          )
          break
        }
        case 'offset': {
          updatedTrack.offset = Math.max(0, initialValue.offset + delta)
          break
        }
      }
  
      onTrackChange(updatedTrack)
    }
  }
  
  

  const onMouseLeave = () => {
    setIsDragging(null)
  }

  return (
    <Tk.Track 
      ref={trackRef}
      style={{ width: `${width}%`, left: `${offset}%`, top: '0' }}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <Tk.DragHandle onMouseDown={(e: MouseEventReact) => onMouseDown(e, 'in')} />
      <Tk.DragHandleInner onMouseDown={(e: MouseEventReact) => onMouseDown(e, 'offset')}>
        <Box ml={.75}>
          { trackData.name }-
          { trackData.in }-
          { trackData.out }
        </Box>
      </Tk.DragHandleInner>
      <Tk.DragHandle onMouseDown={(e: MouseEventReact) => onMouseDown(e, 'out')} />
    </Tk.Track>
  )
}

const Tk = {
  Track: styled.div`
    height: 100%;
    box-shadow: var(--F_Outline);
    display: flex;
    align-items: center;
    position: absolute;
    cursor: grab;
  `,
  DragHandle: styled.div`
    width: 24px;
    height: 100%;

    cursor: ew-resize;
    position: absolute;
    top: 0;
    &:first-child {
      left: 0;
      border-right: 1px dashed var(--F_Surface_2);
    }
    &:last-child {
      right: 0;
      border-left: 1px dashed var(--F_Surface_2);
    }
  `,
  DragHandleInner: styled.div`
    width: calc(100% - 48px);
    margin-left: 24px;
    height: 100%;
    display: flex;
    align-items: center;
  `
}


interface LayerProps {
  scale: number,
  trackData: TrackData[],
  totalFrames: number,
  onTrackChange: (newTrackData: TrackData) => void
}

export const Layer = ({ 
  scale, 
  trackData, 
  onTrackChange, 
  totalFrames 
}: LayerProps) => {

  return (
    <L.Layer>
      {
        trackData.map(track =>
          <Track 
            width={((track.out - track.in) / totalFrames) * 100} 
            offset={(track.offset / totalFrames) * 100}
            trackData={track} 
            onTrackChange={onTrackChange}
          />
        )
      }
    </L.Layer>
  )
}

const L = {
  Layer: styled.div`
    width: 100%;
    height: var(--F_Input_Height);
    background: var(--F_Surface);
    overflow-x: auto;
    display: flex;
    position: relative;
  `
}


interface TimelineProps {
  
}

export const Timeline = ({ }: TimelineProps) => {
  const [frameRate, setFrameRate] = useState(30)
  const [totalFrames, setTotalFrames] = useState(1000)

  const [scale, setScale] = useState(50)

  const [trackData, setTrackData] = useState([
    {
      id: '1',
      name: 'Clip 1.mp4',
      originalFrames: 500,
      rate: 30,
      in: 0,
      out: 500,
      offset: 0
    },
    {
      id: '2',
      name: 'Clip 2.mp4',
      originalFrames: 300,
      rate: 30,
      in: 0,
      out: 300,
      offset: 500
    }
  ])

  const [history, setHistory] = useState([trackData])
  const [pointer, setPointer] = useState(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const debounceUpdateHistory = (newData: TrackData[]) => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setHistory(prev => {
        const newHistory = prev.slice(0, pointer + 1)
        newHistory.push(newData)
        return newHistory
      })
      setPointer(prev => prev + 1)
    }, 300)
  }

  const undo = () => {
    if (pointer > 0) {
      setPointer(prev => {
        const newPointer = prev - 1
        setTrackData(history[newPointer])
        return newPointer
      })
    }
  }

  const redo = () => {
    if (pointer < history.length - 1) {
      setPointer(prev => {
        const newPointer = prev + 1
        setTrackData(history[newPointer])
        return newPointer
      })
    }
  }

  useEffect(() => {
    if (pointer === history.length - 1 || pointer === -1) {
      debounceUpdateHistory(trackData)
    }
  }, [trackData])

  return (<T.Timeline>
    <T.Top>
      <Gap>
        <Box width={8}>
          <NumberSlider
            value={scale}
            onChange={val => setScale(val)}
            precise
            min={1}
            max={100}
          />
        </Box>
        <Button
          icon='undo'
          iconPrefix='fas'
          minimal
          compact
          onClick={undo}
        />
        <Button
          icon='redo'
          iconPrefix='fas'
          minimal
          compact
          onClick={redo}
        />
      </Gap>
    </T.Top>
    <TimeRuler totalFrames={totalFrames} frameRate={frameRate} />
    <T.Layers>
      <Layer 
        trackData={trackData} 
        totalFrames={totalFrames}
        scale={scale} 
        onTrackChange={newTrackData => {
          const targetTrackIndex = trackData.findIndex(track => track.id === newTrackData.id)
          setTrackData(trackData.map(((track, index) => 
            index === targetTrackIndex
              ? newTrackData
              : track
          )))
        }}
      />
    </T.Layers>
  </T.Timeline>)
}

const T = {
  Timeline: styled.div`
    width: 100%;  
    user-select: none;
  `,
  Top: styled.div`
    width: 100%;
    height: var(--F_Input_Height_Compact);
    padding: .5rem 0;
  `,
  Layers: styled.div`
    width: 100%;  
  `
}


interface TimeRulerProps {
  frameRate: number
  totalFrames: number
}

const framesToTime = (frames: number, frameRate: number) => {
  const totalSeconds = frames / frameRate
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds - (hours * 3600)) / 60)
  const seconds = Math.floor(totalSeconds - (hours * 3600) - (minutes * 60))

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export const TimeRuler: React.FC<TimeRulerProps> = ({ frameRate, totalFrames }) => {
  return (
    <Tr.TimeRuler>
      {Array.from({ length: 7 }, (_, i) => i * 15).map(percentage => {
        const frames = Math.floor((percentage / 100) * totalFrames)
        const time = framesToTime(frames, frameRate)
        return (
          <Tr.TimeMark key={time} style={{ left: `${percentage}%` }}>
            <Tr.Line />
            <Tr.TimeLabel>{time}</Tr.TimeLabel>
          </Tr.TimeMark>
        )
      })}
    </Tr.TimeRuler>
  )
}

const Tr = {
  TimeRuler: styled.div`
    position: relative;
    width: 100%;
    height: calc(var(--F_Input_Height) / 2);
    background: var(--F_Surface_0);
    background-image: repeating-linear-gradient(
      to right,
      var(--F_Surface),
      var(--F_Surface) 1px,
      transparent 1px,
      transparent calc(100% / 200)
    );
  `,
  TimeMark: styled.div`
    position: absolute;
    bottom: 0;
    height: 100%;
  `,
  Line: styled.div`
    position: absolute;
    width: 1px;
    height: var(--F_Input_Height);
    background-color: var(--F_Font_Color_Label);
  `,
  TimeLabel: styled.div`
    position: absolute;
    bottom: .125rem;
    padding-left: .25rem;
    color: var(--F_Font_Color_Label);
  `
}