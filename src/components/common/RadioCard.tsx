import { Button, useColorModeValue, useRadio } from '@chakra-ui/react'
type RadioCardProps = {
  tag: string,
  predicted: number | boolean,
}

const RadioCard = ({ tag,predicted, ...radioProps }: RadioCardProps) => {
  const { getInputProps, getCheckboxProps } = useRadio(radioProps)

  const brandColors = useColorModeValue('blue.600', 'blue.700')

  const input = getInputProps()
  const checkbox = getCheckboxProps()
  const predictedValue = predicted === true ? 100 : predicted === false ? 0 : predicted * 100;
  //Calculate the color of the button based on the tag
  const color = () => {
    let base = 300;
    if(predicted === true){
      return "blue."+base;
    }else if (predicted === false){
      return "white";
    }
    if(predicted > 0){
      
      //the colors are in the range of 50,100,200,300
      if(base*predicted >= 300){
        return "blue.300";
      }
      else if(base*predicted >= 200 && base*predicted < 300){
        return "blue.200";
      }
      else if(base*predicted >= 100 && base*predicted < 200){
        return "blue.100";
      }
      else if(base*predicted <= 100){
        return "blue.50";
      }
      else{
        return "blue.50";
      }
    }
    else{
      return "white";
    }
  }

  return (
    <Button
      size="sm"
      as="label"
      cursor="pointer"
      {...checkbox}
      
      bg={color()}

      
      _checked={{
        bg: brandColors,
        color: 'white',
      }}
    >
      {tag}
      {
        color() !== "white" && predicted && (
          <div style={{display: "block", width: 'auto', height:'auto', position:'absolute', top: '-12px', background:'#FAF089', color:'black', borderRadius: 5, padding: '2px 3px', fontSize: 12}}>{predictedValue/100}%</div>
        )
      }
      <input {...input} />
    </Button>
  )
}

export default RadioCard
