/**
 * 1 . Render song
 * 2. Scroll top
 * 3. Play / pause / seek
 * 4. CD rotate
 * 5. next / prev
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2')
const cdthump = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd');
const togglePlay = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')
const app = {
    currentIndex : 0,
    isPlaying : false,
    isRandom : false,
    isRepeat : false,
    songs : [
        {
            name : 'Nevada',
            singer: 'vicetone',
            path: '/song/music/Nevada - Vicetone_ Cozi Zuehlsdorff.mp3',
            img: '/song/img/Nevada.jpg'
        },
        {
            name : 'Monody',
            singer: 'The Fat Rat',
            path: '/song/music/Monody-TheFatRatLauraBrehm-4174394.mp3',
            img: '/song/img/TheFatRat.jpg'
        },
        {
            name : 'Summer Time',
            singer: 'Cinnamons',
            path: '/song/music/summertime.mp3',
            img: '/song/img/summertime.jpg'
        },
        {
            name : 'The Night',
            singer: 'Avicii',
            path: '/song/music/thenight.mp3',
            img: '/song/img/thenight.jpeg'
        },
        {
            name : 'Counting Stars',
            singer: 'OneRepublic',
            path: '/song/music/Counting Stars - OneRepublic.mp3',
            img: '/song/img/counting stars.jpg'
        },
        {
            name : 'The Playah',
            singer: 'Soobin',
            path: '/song/music/ThePlayahSpecialPerformance-SoobinHoangSonSlimV-7020741.mp3',
            img: '/song/img/playyah.jpg'
        },
        ],
        //Render
    render: function() {
        const html = this.songs.map( (song , index) => {
        
            return `<div class="song ${index === app.currentIndex ? 'active' : ''} " data-index="${index}">
                <div class="thumb" style="background-image: url('${song.img}')">
                </div>
                <div class="body">
                  <h3 class="title">${song.name}</h3>
                  <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                  <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`
        })
        $('.playlist').innerHTML = html.join('')
    },
    definedProperties: function() {
        Object.defineProperty(this,'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function() {
        
        const cdWidth = cd.offsetWidth;

         // CD rotate

         const cdAnimate =  cdthump.animate([
            { transform: 'rotate(360deg)',},
        ],{
            duration: 10000,
            iterations: Infinity
        }
        )
        cdAnimate.pause()

        

        //Scroll top
        document.onscroll = () => {
            console.log(document.documentElement.scrollTop );
            const scrollTop = document.documentElement.scrollTop || window.scrollY;
            const newCdWidth = cdWidth - scrollTop;
            console.log(newCdWidth );       
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth
        }
        // Xu ly play / pause
        togglePlay.onclick = () => {
            if(this.isPlaying){
                audio.pause ()
                
            }else{
                audio.play()
            }
            audio.onplay = function(){
                app.isPlaying = true;
                player.classList.add('playing');
                cdAnimate.play()

            };
            audio.onpause = function(){
                app.isPlaying = false
                player.classList.remove('playing')
                cdAnimate.pause()
            };

        // Khi tien do bai hat thay doi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor( audio.currentTime / audio.duration *100 )
                progress.value = progressPercent    
            }
        }

        // Seek
        progress.onchange = function(e){
            const seekTime = audio.duration * e.target.value /100
            audio.currentTime = seekTime
        }
        
    }
        // NextSong
        nextBtn.onclick=function(){
            if(this.random){
            app.playRandomSong();
            }
            else{
            app.nextSong();
            app.isPlaying = true;
            player.classList.add('playing');
            cdAnimate.cancel();
            cdAnimate.play();
            audio.play();  
            app.render();
            app.scrollToActiveSong();
            }      
        }
        // PreviousSong
        prevBtn.onclick=function(){       
            app.prevSong();
            app.isPlaying = true;
            player.classList.add('playing');
            cdAnimate.cancel();
            cdAnimate.play();
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }
        // Random song
        randomBtn.onclick=function(){
            app.isRandom = !app.isRandom;
            randomBtn.classList.toggle('active' , app.isRandom);
            // app.playRandomSong();
        }
        // Repeat
        repeatBtn.onclick = function(){
            app.isRepeat = !app.isRepeat;
            repeatBtn.classList.toggle('active',app.isRepeat)
        }
        // NextSong When Ended
        audio.onended = function(){
            if(app.isRepeat){
                audio.play()
            }
            else{
                nextBtn.click();
            }
        }

        // Play song when click
        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode ){
                if(songNode){
                    app.currentIndex =  Number(songNode.dataset.index) // .getAttribute('data-index')
                    app.loadCurrentSong()
                    app.render()
                    app.isPlaying = true;
                    player.classList.add('playing');
                    cdAnimate.play()
                    audio.play()
                }
                if(e.target.closest('.option')){

                }
            }
        }

    },

    nextSong: function(){
        app.currentIndex++;
            if(app.currentIndex >= app.songs.length-1){
                
            }
            app.loadCurrentSong();
            
        }
     ,
     prevSong: function(){
        app.currentIndex--;
            if(app.currentIndex < 0){
                app.currentIndex = app.songs.length -1 ;
            }
            app.loadCurrentSong();
        }
     ,
     playRandomSong: function() {
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * app.songs.length) ;
        }while(newIndex === this.currentIndex)
        console.log(newIndex) ;
        app.currentIndex = newIndex ;
        this.loadCurrentSong();
     }
     ,
     scrollToActiveSong: function(){
        $('.song.active').scrollIntoView({
            behavior : 'smooth',
            block: "end", 
            inline: "center",
        })
     },
     
    loadCurrentSong: function() {
        
        heading.innerText  =  app.currentSong.name;
        cdthump.style.backgroundImage = `url('${app.currentSong.img}')`;
        audio.src = app.currentSong.path
        
    },

    start: function(){
        // Dinh nghia cac thuoc tinh cho Object
        this.definedProperties()
        // lang nghe va xu ly cac su kien
        this.handleEvents()

        // Tai thong tin bai hat dau tien vao ung dung khi chay
        this.loadCurrentSong()

        this.render()
    }

}

app.start()

