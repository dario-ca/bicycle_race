function Filters(){

	this.gender=null;
	this.usertype=null;
	this.date=null;
	this.age_min=null;
	this.age_max=null;
}

Filters.prototype.setGender=function(gender){
	this.gender=gender;
}

Filters.prototype.setUsertype=function(type){
	thie.usertype=type;
}

Filters.prototype.setDate=function(day){
	this.date=day;
}

Filters.prototype.setAge=function(agemin,agemax){
	this.age_min=agemin;
	this.age_max=agemax;
}

Filters.prototype.getGender=function(){
	return this.gender;
}

Filters.prototype.getUsertype=function(){
	return this.usertype;
}

Filters.prototype.getDate=function(){
	return this.date;
}

Filters.prototype.getAgeMin=function(){
	return this.age_min;
}

Filters.prototype.getAgeMax=function(){
	return this.age_max;
}