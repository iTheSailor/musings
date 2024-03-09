from rest_framework.views import APIView
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.response import Response
from . import forecast
from .models import Sudoku, UserLocation
from . import sudoku_logic
from django.contrib.auth.models import User
from .serializers import SudokuSerializer
import json
from django.http import JsonResponse

class WeatherView(APIView):
    def get(self, request, format=None):
        search = json.dumps(request.GET)
        search = json.loads(search)
        data = forecast.location(search)
        weather_raw = data['weather']
        current = data['current']
        address = data['address']
        weather = WeatherView.transform_weather_data(weather_raw)
        supplement_data = data['supplement']
        transformed_supplement = {}
        if supplement_data:
            for date, forecasts in supplement_data['supplement'].items():
                detailed_forecasts = [{'detailedForecast': period['detailedForecast'], 
                                    'isDaytime': period['isDaytime']} for period in forecasts]
                transformed_supplement[date] = detailed_forecasts
                supplement = transformed_supplement
        else:
            supplement_data = {}
            for date in weather_raw['date']:
                supplement_data[date] = ["No supplemental data available for this location."]
            supplement = supplement_data
        geodata = data['geodata']
        country_code = search['country_code']
        timezone = search['timezone']
        # 

        result = { 'weather': weather, 
                    'address': address, 
                    'supplemental': supplement, 
                    'geodata': geodata,
                    'current': current,
                    'country_code': country_code,
                    'timezone': timezone
                    }

        return Response(result)
    
    
    
    def post(self, request, format=None):
        user_id = request.data['user']
        user = User.objects.get(id=user_id)
        address = request.data['address']
        nickname = request.data['nickname']
        lat = request.data['lat']
        lon = request.data['lon']
        timezone = request.data['timezone']
        country_code = request.data['country_code']
        user_location = UserLocation(user=user, address=address, nickname=nickname, lat=lat, lon=lon, timezone=timezone, country_code=country_code)
        user_location.save()
        return Response({'status': 'success'})
    
    @staticmethod
    def transform_weather_data(weather_data):
        transformed_data = []
        for i in range(len(weather_data['date'])):  
            day_data = {}
            for key, values in weather_data.items():
                day_data[key] = values[i]  
            transformed_data.append(day_data)
        return transformed_data
    
class UserLocationView(APIView):
    def get(self, request, format=None):
        user_id = request.GET['user']
        user = User.objects.get(id=user_id)
        user_locations = UserLocation.objects.filter(user=user)
        locations = []
        for location in user_locations:
            locations.append({
                'locationId': location.id,
                'address': location.address,
                'nickname': location.nickname,
                'lat': location.lat,
                'lon': location.lon,
                'formatted': location.address,
                'timezone': location.timezone,
                'country_code': location.country_code
            })
        return Response(locations)
    
    def delete(self, request, format=None):
        location_id = request.data['location_id']
        location = UserLocation.objects.get(id=location_id)
        user = location.user
        location.delete()
        user_locations = UserLocation.objects.filter(user=user)
        locations = []
        for location in user_locations:
            locations.append({
                'locationId': location.id,
                'address': location.address,
                'nickname': location.nickname,
                'lat': location.lat,
                'lon': location.lon
            })
    
        return Response({'status': 'success', 'data': locations})
    
    def put(self, request, format=None):
        location_id = request.data['location_id']
        nickname = request.data['nickname']
        location = UserLocation.objects.get(id=location_id)
        location.nickname = nickname
        location.save()
        return Response({'status': 'success'})
    
class GenerateSudokuView(RetrieveUpdateAPIView):
    def get(self, request, format=None):
        try:
            userid = request.GET['userid']
            user = User.objects.get(id=userid)
        except:
            user = None
        difficulty = request.GET['difficulty']
        puzzle = sudoku_logic.generate_puzzle(difficulty)
        puzzle_list = puzzle.tolist()
        if puzzle is not None:
            Sudoku.objects.create(
                difficulty=difficulty, 
                puzzle=puzzle_list, 
                current_state=puzzle, 
                player=user)
            game = Sudoku.objects.filter(puzzle=puzzle_list, player=user).latest('created_at')
            
            return Response(
                {'status': 'success', 
                 'gameid' : game.id, 
                 'puzzle': puzzle_list,
                 'difficulty': game.difficulty,
                 'time': game.time})
        else:
            return Response({'status': 'failure'})
        
    def put(self, request, format=None):
        data = json.loads(request.body)
        sudoku_id = data['sudoku_id']
        time = data['time']
        sudoku = Sudoku.objects.get(id=sudoku_id)
        sudoku.time = time
        sudoku.save()
        return Response({'status': 'success'})


def create_sudoku_game(request):
    data=request.GET
    print(data)
    userid = data['userid']
    difficulty = data['difficulty']
    pack = {'userid': userid, 'difficulty': difficulty}
    game = Sudoku.create(pack)
    if game:
        serializer = SudokuSerializer(game)
        return JsonResponse(serializer.data, safe=False)
    else:
        return JsonResponse({'error': 'Failed to create game'}, status=404)

    
def get_user_games(request):
    userid = request.GET['userid']
    games = Sudoku.get_user_games(userid)
    if games:
        serializer = SudokuSerializer(games, many=True)
        return JsonResponse(serializer.data, safe=False)  # Convert to JSON and return
    else:
        return JsonResponse({'error': 'User not found or no games available'}, status=404)

def delete_game(request):
    data= json.loads(request.body)
    gameid = data['gameid']
    userid = data['userid']
    
    deleted = Sudoku.delete_game(gameid, userid)
    if deleted:
        return JsonResponse({'status': 'success'})
    else:
        return JsonResponse({'status': 'failure'}, status=404)
    
def save_game(request):
    data = json.loads(request.body)
    gameid = data['gameid']
    current_state = data['current_state']
    time = data['time']
    saved = Sudoku.save_game(gameid, current_state, time)
    if saved:
        return JsonResponse({'status': 'success'})
    else:
        return JsonResponse({'status': 'failure'}, status=404)

        
class UpdateSudokuTimeView(APIView):
    def put(self, request, format=None):
        data = json.loads(request.body)
        sudoku_id = data['sudoku_id']
        
        time = data['time']
        sudoku = Sudoku.objects.get(id=sudoku_id)
        sudoku.time = time
        sudoku.save()
        return Response({'status': 'success'})
        
class SolveSudokuView(APIView):
    def post(self, request, format=None):
        try:
            data= json.loads(request.body)
            puzzle = data['puzzle']
            solution = data['solution']
            is_correct = sudoku_logic.check_sudoku_board(puzzle, solution)
            return Response({'status': 'success', 'is_correct': is_correct})
        except:
            return Response({'status': 'failure'})

class LoginView(APIView):
    def post(self, request, format=None):
        username = request.data['username']
        password = request.data['password']
        user = User.objects.get(username=username)
        if user.check_password(password):
            return Response({'status': 'success', 'username': username, 'user_id': user.id})
        else:
            return Response({'status': 'failure'})
        

class SignupView(APIView):
    def post(self, request, format=None):
        username = request.data['username']
        password = request.data['password']
        email = request.data['email']
        user = User.objects.create_user(username, email, password)
        user.save()
        return Response({'status': 'success', 'username': username})
