function Filters(){
    
	this.gender=null;
	this.usertype=null;
	this.date=null;
	this.station=null;
	this.age_min=null;
	this.age_max=null;
}

Filters.prototype.setGender=function(gender){
	this.gender=gender;
}

Filters.prototype.setUsertype=function(type){
	this.usertype=type;
}

Filters.prototype.setDate=function(day){
	this.date=day;
}

Filters.prototype.setStation=function(stat){
	this.station=stat;
}

Filters.prototype.setAge=function(agemin,agemax){
	this.age_min=agemin;
	this.age_max=agemax;
}

Filters.prototype.apply = function(windowNumber){
    console.log(windowNumber);

    switch(windowNumber){
        case 1:
            app1.setOption(this.station, this.gender, this.usertype);
            app2.getBikesForallDays(this.station, this.gender, this.usertype);
            app3.getBikesForallMonths(this.station, this.gender, this.usertype);
            app4.setOption(this.station, this.gender, this.usertype);
            break;
        case 2:
            app3.getBikesFarallIntervals(this.station, this.gender, this.usertype);
            app4.getBikesFarallIntervals(this.station, this.gender, this.usertype);
            break;
        case 4:
            app1.setOption(this.station, this.gender, this.usertype, this.date);
            app2.setOption(this.station, this.gender, this.usertype);
            app3.setOption(this.date);
    }
}

Filters.prototype.resetFilters = function(){
	console.log("Reset Filters");
    this.gender=null;
	this.usertype=null;
	this.date=null;
	this.station=null;
	this.age_min=null;
	this.age_max=null;   
}
