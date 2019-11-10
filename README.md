# useForm
An experiment in React hooks to generalize a web form

As an experiment / educational exercise I wanted to build a React hook that abstracts the basic functions of a web form. Namely:

 - Accepting the initial values of the form and keeping track of those values as they are changed.
 - Allow the caller to specify validation functions, validate the form and keep track of any current errors.
 - Accept a function responsible for submitting the form.
 - Keep track of the form's state (fresh, submitting, successful or failed)

# Reflection

Upon creating it, my first question is "is this hook too abstract to be useful in real life?". For example, the hook is not concerned with the actual mechanics of how data will be submitted. A real life project might follow a convention for how form submission might work (posting data to a RESTful endpoint, submitting a GraphQL mutation with fields mapped to parameters, etc) and would like to include those conventions in a form hook. But who knows? On the other hand it was also a useful exercise to think about the basic functionality that pretty much any modern web form needs to have. Furthermore, Its easy to imagine using a hook like this one with other general hooks or functions to handle related functions. For example, what if a separate function was responsible for generating a submission function with basic assumptions about your project baked in, and a narrower and simpler API? Similarly, a component could generalize the presentation of a form based on its data.

Whether this hook gets used an an actual project or not, it was fun to try my hand at designing with te Unix philosophy in mind: small tools with a wide range of use cases that can be strung together to create something useful. 