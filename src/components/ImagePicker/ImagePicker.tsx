import React from 'react'

import { Button, Spacer, Notification, AspectRatio, Box, Gap, NumberSlider } from '../../internal'

// libraries
import styled from 'styled-components'
import { useState, useCallback, useRef, useEffect } from 'react'
import Cropper from 'react-easy-crop'
import { IconName, IconPrefix } from '@fortawesome/fontawesome-common-types'

const createImage = (url : string) : HTMLImageElement =>
  // @ts-ignore
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', error => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
  })

const getRadianAngle = (degreeValue : number) => {
  return (degreeValue * Math.PI) / 180
}

export function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

export const cropImage = async (
  imageSrc: string, 
  pixelCrop: { x: number, y: number, width: number, height: number }, 
  rotation = 0,
  flip: { horizontal: boolean, vertical: boolean }
) => {
  
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);

  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  ctx.drawImage(image, 0, 0);

  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );


  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.putImageData(data, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      if (file) {
        resolve(URL.createObjectURL(file))
      }
    }, 'image/png');
  })
}

interface CroppedAreaPixels {
  x: number,
  y: number,
  width: number,
  height: number
}

interface Props {
  label?: string,
  onChange: (src: string) => void,
  value: string,
  ratio: number,
  circle?: boolean,
  hero?: boolean,
  icon?: IconName,
  iconPrefix: IconPrefix,
  showPlaceholder?: boolean,
  placeholderRatio?: number
}

/**
 * `ImagePicker` is a component that allows users to select and crop images. It provides functionality for uploading new images,
 * editing them via cropping and rotation, and displaying the current selection. It can be used as a standalone image selection input
 * or integrated with forms for profile pictures, galleries, and more.
 *
 * @component
 * @param {function} onChange - Callback function invoked with the new image source after cropping.
 * @param {string} value - The current image source URL, to be displayed and edited.
 * @param {string} [label='image'] - Label for the image picker, used in buttons and placeholders.
 * @param {number} [ratio=1] - The aspect ratio for the cropping area.
 * @param {boolean} [circle] - If true, the cropping area will be circular, ideal for profile pictures.
 * @param {boolean} [hero] - Indicates if the component should use a large display style.
 * @param {IconName} [icon] - FontAwesome icon name for the upload button.
 * @param {IconPrefix} iconPrefix - FontAwesome icon prefix, determines the style of the icon.
 * @param {boolean} [showPlaceholder] - If true, shows a placeholder when no image is selected.
 * @param {number} [placeholderRatio] - Aspect ratio for the placeholder if no image is provided.
 *
 * @example
 * // ImagePicker for profile picture selection
 * <ImagePicker
 *   label="profile picture"
 *   value={currentImageSrc}
 *   onChange={newImageSrc => setImage(newImageSrc)}
 *   ratio={1}
 *   circle
 *   hero
 *   icon="user"
 *   iconPrefix="fas"
 * />
 */
export const ImagePicker = ({
  onChange,
  value,
  label = 'image',
  ratio = 1,
  circle,
  hero,
  icon,
  iconPrefix,
  showPlaceholder,
  placeholderRatio
} : Props) => {

  const [loading, setLoading] = useState(false)
  const [editing, set_editing] = useState(false)
  const [error, setError] = useState(null)

  const [croppedAreaPixels, setCroppedAreaPixels] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  })

  const [file, setFile] = useState<File | null>(null)

  const [editSrc, set_editSrc] = useState(value)

  

  const onClickHandler = () => {
    (document.querySelector('#fileInput') as HTMLInputElement)?.click()
  }

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)

  const onCropComplete = useCallback((croppedArea: any, new_croppedAreaPixels: CroppedAreaPixels) => {
    setCroppedAreaPixels(new_croppedAreaPixels)
  }, [])

  const onCrop = () => {
    

    (async () => {
      const newSrc = await cropImage(editSrc, croppedAreaPixels, rotation, { horizontal: false, vertical: false } )
      if (newSrc) {
        onChange(newSrc as string)
        setZoom(1)
        setRotation(0)
        set_editing(false);
      }
    })()
  }

  const reset = () => {
    onChange('')
    // setZoom(1)
    // setRotation(0)
  }

  const onClear = () => {
    reset()
  }

  return (<S_Container>
    <input type='file' id='fileInput' accept='image/*'
      style={{display: 'none'}}
      onChange={e => {
        const newFile = (e.target as HTMLInputElement).files?.[0]
        if (newFile) {
          setFile(newFile)
          set_editSrc(URL.createObjectURL(newFile))
          set_editing(true)
        }
      }}
    />
    
    <Gap gap={.75}>

      {
        error
          ? <Notification type='error' iconPrefix='fas'>
              {
                error
              }
            </Notification>
          : null
      }

      <Box hide={editing} width='100%'>
        <AspectRatio 
          backgroundSrc={value} 
          ratio={
            value
              ? ratio
              : placeholderRatio 
                ? placeholderRatio
                : ratio
          } 
        >
          {
            !value &&
              <Button
                text={`Select ${label}`}
                onClick={onClickHandler}
                expand={true}
                expandVertical={true}
                icon={icon}
                iconPrefix={iconPrefix}
                hero={hero}
                secondary
              />
          }
          
        </AspectRatio>
      </Box>
    
      {
        !editing && value &&
          <Box width='100%'>
            <Gap disableWrap={true}>
            <Spacer>
              <Button
                text={value ? `Change ${label}` : `Select ${label}`}
                onClick={onClickHandler}
                expand={true}
                icon={icon}
                iconPrefix={iconPrefix}
                hero={hero}
                secondary={true}

              />
            </Spacer>
          
              <Button
                icon={'crop'}
                iconPrefix={iconPrefix ? iconPrefix : 'fas'}
                onClick={() => {
                  set_editing(true)
                }}
                secondary={true}
                hero={hero}
                text='Crop'
              />
          
              <Button
                onClick={onClear}
                secondary={true}
                icon='trash-alt'
                iconPrefix={iconPrefix ? iconPrefix : 'fas'}
                hero={hero}
                circle={true}
              />
            </Gap>
          </Box>
        }
      </Gap>
    {
      editSrc && editing
        ?  <S_CropperContainer>
            <AspectRatio ratio={ratio + .2}>
              <Cropper
                image={editSrc}
                crop={crop}
                zoom={zoom}
                aspect={ratio}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                rotation={rotation}
                onRotationChange={setRotation}
                onZoomChange={setZoom}
                objectFit={'horizontal-cover'}
                cropShape={circle ? 'round' : 'rect'}
                
              />
            </AspectRatio>
          
            <Spacer>
              <Button
                text={loading ? 'Saving...' : `${label ? 'Save ' + label : 'Save'}`}
                disabled={loading}
                primary={!loading}
                onClick={onCrop}
                expand={true}
                hero={hero}
                icon={icon}
                iconPrefix={iconPrefix}
                blink={!loading}
              />
            </Spacer>
        
            <Button
              text={'Cancel'}
              disabled={loading}
              secondary={true}
              onClick={() => {
                set_editing(false)}
              }
              hero={hero}

            />
          
          </S_CropperContainer>
        : null
    }

    {
      (editing) && 
        <S_Spacer>
          <AspectRatio ratio={editing ? ratio + .2 : ratio}>
          </AspectRatio>
        </S_Spacer>
    }


  </S_Container>)
}

const S_Container = styled.div`
  width: 100%;
  position: relative;
`

const S_CropperContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: .75rem;

`


const S_Spacer = styled.div`
  width: 100%;
  pointer-events: none;
  padding-bottom: calc(var(--F_Input_Height) + .75rem);
`