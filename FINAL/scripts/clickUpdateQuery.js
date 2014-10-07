function clickUpdateQuery(DOC,n) {

	id = DOC.getElementById("options");

	switch(n) {
		case 1:
			drawQuery_Calendar(id);
			break;
		case 2:
			drawQuery_Stations(id);
			break;
		case 3:
			drawQuery_Demographics(id);
			break;
		case 4:
			drawQuery_Week(id);
			break;
		case 5:
			drawQuery_Time(id);
			break;
		default:
			drawQuery_Calendar(id);
	} 



}
