let containers = document.getElementsByClassName('logo_container');
let isMouseOver = false;
let isThrottled = false;
let docStyle = getComputedStyle(document.documentElement);
let fadeDuration = docStyle.getPropertyValue('--fade-duration'); 
let stateArray = new Array();


// parse fade-duration (could be ms or s)
(fadeDuration.indexOf('ms') !== -1) ? 
    fadeDuration = parseFloat(fadeDuration.replace('ms', '')) : 
    fadeDuration = parseFloat(fadeDuration.replace('s', '')) * 1000
  

// throttle-Decorator: When wrapper is called multiple times, it passes the  
// call to f at maximum once per ms milliseconds. Here, all throttle decorators 
// use the global "isThrottled" variable.
function throttle(func, ms, idx) {
    
        function wrapper() {
            if (isThrottled) {
            return;
            }
            isThrottled = true;

            func.apply(this, arguments);

            setTimeout(function() {
                isThrottled = false;
            }, ms);
        }

    return wrapper;
}

function switchAnimation (classListWhite, classListColor) {
    if (!( 
        // check for any status classes on child elements
        classListWhite.contains('active') || 
        classListWhite.contains('inactive') || 
        classListColor.contains('active') || 
        classListColor.contains('inactive') 
    )) { 
        // on first click initiate animation states (active, inactive) 
        classListWhite.add('inactive');
        classListColor.add('active');
    } else {
        // on subsequent clicks, toggle animation states
        classListWhite.toggle('active');
        classListColor.toggle('active');
        classListWhite.toggle('inactive');
        classListColor.toggle('inactive');
    }

    // always remove rotate class for smooth finish
    classListWhite.remove('rotate');
    classListColor.remove('rotate');

    // if mouse still hovers after animation -> restart rotation
    setTimeout(() => {
        if (isMouseOver) {
            classListWhite.add('rotate');
            classListColor.add('rotate');
        }
    }, fadeDuration)
}

function forwardRotation(classListWhite, classListColor) {
    classListWhite.add('rotate');
    classListColor.add('rotate');
}

function backwardRotation(classListWhite, classListColor) {
    classListWhite.remove('rotate');
    classListColor.remove('rotate');
}


switchAnimation = throttle(switchAnimation, fadeDuration);
forwardRotation = throttle(forwardRotation, 0);
backwardRotation = throttle(backwardRotation, 0);


class ContainerState {
    contructor() {
        this.isMouseOver = false;
        this.isThrottled = false;
    }
}

// set up event listeners for all logo containers
Array.from(containers).forEach((c, idx) => {

    stateArray.push(
        new ContainerState()  
    )

    let classes_w = c.children[0].classList
    let classes_c = c.children[1].classList

    // mouseover-event initiates rotation 
    c.addEventListener('mouseover', ()=>{
        forwardRotation(classes_w, classes_c, idx)
        isMouseOver = true;
        })

    // mouseout-event reverses rotation
    c.addEventListener('mouseout', ()=>{
        backwardRotation(classes_w, classes_c, idx)
        isMouseOver = false;
        })

    // click-event initiates animations by switching state classes
    c.addEventListener('click', ()=>{
        switchAnimation(classes_w, classes_c, idx)
        })

    })






