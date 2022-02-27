# Patterns to follow while creating Atoms
- It must contain only single html element like h1,h2,li,button etc.
- Cannot be further divided into sub-components.
- Can style the element.
- Dumb Components avoid using logic at this level.
- Any modification should be done via props.
- Don't use slots at this level