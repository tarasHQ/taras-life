## Inspection

- capacitors every 3-6 Months
- is "temp" side board fixed enough to not fall off?

## New Cooling

- ### What I need to do?
  1. Disconnect everything from the inverter and connect to the power grid directly
     1. Stop recording and continue through power grid.
     2. Stop mini pc and turn on when on grid
  2. Disable inverter
  - ##### Coolers
    1. Detach coolers and move their wiring outside, so it's accessible
    2. Remove 1-2cm of old heat shrink tubes
    3. Cut + wire
    4. **Place another tube (that fits diode)**
    5. Solder in diode with the **stripe towards cooler**
    6. do it twice for both coolers
    7. Place tube to properly cover things and heat up.
    8. Connect coolers back into the board
    9. DONE.
  - ##### DCDC Buck Converter
    - ###### LOCATION - On the right-hand side of the inverter
      - You need long-ish wires. 3 red ones and a black one.
    1. Solder **INPUT plus** to the "transistor array's input"-place
    2. Minus is connected, so **OUTPUT minus** goes to any **cooler's minus**.
    3. Solder diode with **stripes towards the cooler** to the **OUTPUT plus** of the converter.
    4. solder 2 wires from diode to **cooler's plus** x2
    5. DONE
- ### Reflections
  - Do I need to disconnect it and place on table, or I can do it on-site?
  - Seems like it won't be hard to do it on site, but gravity may be PIA with soldering, so you'll have to solder it through supplying "solder-thing" directly to the location, instead of "soldering device", don't know names in English.
  - Can I wire it on button? Ideally yes, but if something goes wrong - current scheme allows to have painless backup.
    - Especially because you have voltage drop on diodes, so you may need to have some boost through bypass for the stock logic.
  - Converter board. Inside vs outside? Current will be low, so it won't heat up. And also it's buck with like 10V difference, so it won't be super wasteful to convert voltage.
    - There's just not enough "safe space" in there. Safer to wire it outside
