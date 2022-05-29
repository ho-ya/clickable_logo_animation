let stateArray = new Array();
let containers = document.getElementsByClassName('logo_container');
let docStyle = getComputedStyle(document.documentElement);
let fadeDuration = docStyle.getPropertyValue('--fade-duration'); 
let rotateDuration = docStyle.getPropertyValue('--rotate-duration'); 

// parse css durations (could be ms or s)
function parseDuration (d) {
    return (d.indexOf('ms') !== -1) ? 
        parseFloat(d.replace('ms', '')) : 
        parseFloat(d.replace('s', '')) * 1000;
}
fadeDuration = parseDuration(fadeDuration);
rotateDuration = parseDuration(rotateDuration);



// use class for independent event tracking of every container/icon
class ContainerState {
    isMouseOver = false;
    isThrottled = false; 

    forwardRotation(classListWhite, classListColor) {
        this.isMouseOver = true;
        if (this.isThrottled) {
            return;
        }
        // rotate logo by adding class
        classListWhite.add('rotate');
        classListColor.add('rotate');
        
        // always complete full rotation (throttle until then)
        this.isThrottled = true;
        setTimeout(() => {
            // initiate backwardRotation if mouseout-event occured while completing forwardRotation
            this.isThrottled = false;
            if (!this.isMouseOver) {
                this.backwardRotation(classListWhite, classListColor) 
            }
        }, rotateDuration);

    }

    backwardRotation(classListWhite, classListColor) {
        this.isMouseOver = false;
        if (this.isThrottled) {
            return;
        }
        // rotate back by removing class
        classListWhite.remove('rotate');
        classListColor.remove('rotate');
        
    }

    switchAnimation (classListWhite, classListColor) {
        //throttling is to prevent double clicking etc. to restart the animation
        if (this.isThrottled) {
            return;
        }
        this.isThrottled = true;

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
    
        // always remove rotate to prevent jitter at animation finish
        classListWhite.remove('rotate');
        classListColor.remove('rotate');
    
        
        setTimeout(() => {
            this.isThrottled = false;
            // if mouse still hovers after animation -> restart rotation
            if (this.isMouseOver) {
                classListWhite.add('rotate');
                classListColor.add('rotate');
            }
        }, fadeDuration);
    }

}

// set up event listeners for all logo containers
Array.from(containers).forEach((c, idx) => {

    // one containerState object for every logo/container
    stateArray.push(
        new ContainerState()  
    )

    let classes_w = c.children[0].classList
    let classes_c = c.children[1].classList

    // mouseover-event initiates rotation 
    c.addEventListener('mouseover', ()=>{
        stateArray[idx].forwardRotation(classes_w, classes_c)

        })

    // mouseout-event reverses rotation
    c.addEventListener('mouseout', ()=>{
        stateArray[idx].backwardRotation(classes_w, classes_c)

        })

    // click-event initiates animations by switching state classes
    c.addEventListener('click', ()=>{
        stateArray[idx].switchAnimation(classes_w, classes_c)
        })

    })






