const { Listener } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Listener({
  name: 'Unit Conversion Listener',
  event: 'messageCreate',

  run: async (ctx) => {
    const conversions = [
      // Temperature conversions
      {
          from: 'C',
          to: 'F',
          conversion: (value) => (value * 9 / 5) + 32,
          type: 'temperature',
          description: 'Celsius to Fahrenheit'
      },
      {
          from: 'F',
          to: 'C',
          conversion: (value) => (value - 32) * 5 / 9,
          type: 'temperature',
          description: 'Fahrenheit to Celsius'
      },
      {
          from: 'C',
          to: 'K',
          conversion: (value) => value + 273.15,
          type: 'temperature',
          description: 'Celsius to Kelvin'
      },
      {
          from: 'K',
          to: 'C',
          conversion: (value) => value - 273.15,
          type: 'temperature',
          description: 'Kelvin to Celsius'
      },
  
      // Length conversions
      {
          from: 'm',
          to: 'ft',
          conversion: (value) => value * 3.28084,
          type: 'length',
          description: 'Meters to Feet'
      },
      {
          from: 'ft',
          to: 'm',
          conversion: (value) => value / 3.28084,
          type: 'length',
          description: 'Feet to Meters'
      },
      {
          from: 'km',
          to: 'ft',
          conversion: (value) => value * 3280.84,
          type: 'length',
          description: 'Kilometers to Feet'
      },
      {
          from: 'ft',
          to: 'km',
          conversion: (value) => value / 3280.84,
          type: 'length',
          description: 'Feet to Kilometers'
      },
  
      // Mass conversions
      {
          from: 'kg',
          to: 'lbs',
          conversion: (value) => value * 2.20462,
          type: 'mass',
          description: 'Kilograms to Pounds'
      },
      {
          from: 'lbs',
          to: 'kg',
          conversion: (value) => value / 2.20462,
          type: 'mass',
          description: 'Pounds to Kilograms'
      }
  ];

  const detectUnit = (content) => {
    const unitPatterns = [
        { unitFor: /(-?\d+(\.\d+)?)\s*(°?\s?C|°?\s?F|°?\s?K)/, type: 'temperature' },
        { unitFor: /(-?\d+(\.\d+)?)\s*(m|ft|km)/, type: 'length' },
        { unitFor: /(-?\d+(\.\d+)?)\s*(kg|lbs)/, type: 'mass' },
    ];

    for (const { unitFor, type } of unitPatterns) {
        const unitPresent = content.match(unitFor);
        if (unitPresent) {
            return { value: parseFloat(unitPresent[1]), unit: unitPresent[3], type };
        }
    }

    return null; 
  };

  const convertUnit = (value, unit, type) => {
    const conversion = conversions.find(conversion => conversion.type === type && conversion.from === unit);
    
    if (conversion) {
        let convertedValue = conversion.conversion(value);
        convertedValue = parseFloat(convertedValue.toFixed(2)); 
        return { convertedValue, conversion }; 
    }

    return null; 
  };

  const detectedUnit = detectUnit(ctx.content);

  if (detectedUnit) {
    const { value, unit, type } = detectedUnit;
    const conversionResult = convertUnit(value, unit, type);

    if (conversionResult) {
      const { convertedValue, conversion } = conversionResult;

      const embed = new EmbedBuilder()
        .setColor(0x8269c2)  
        .addFields(
          { name: `${value} ${unit}`, value: `${convertedValue} ${conversion.to}`, inline: true },
        );

      await ctx.reply({ embeds: [embed] });
    }
  }
}
});