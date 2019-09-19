function main(init, render, beforeRender, afterRender) {
    init();

    function animate(){
        requestAnimationFrame( animate );
        beforeRender()
        render();
        afterRender();
    }
    animate();
}
                
export default main;