<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:admin');
    }

    public function CategorieCreation(Request $request)
    {
		$body = json_decode($request->getContent());
		
		$idCategorie = $body->idCategorie;
		$nom = $body->nom;
		$matiere = $body->matiere;
		$niveau = $body->niveau;
		$estPublic = $body->estPublic;
		
		$idMaitresseCreatrice = JWTAuth::parseToken()->getPayload()["sub"];
		
		if (!isset($idCategorie, $nom, $matiere, $niveau, $estPublic))
			return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);
		
		DB::insert('
			INSERT INTO `categorie`
			(`idCategorie`, `nom`, `matiere`, `niveau`, `estPublic`, `idMaitresseCreatrice`) 
			VALUES (?,?,?,?,?,?)', [$idCategorie, $nom, $matiere, $niveau, $estPublic, $idMaitresseCreatrice]);
			
		return response()->json(["code" => "200", "message" => "OK"], 200);
    }
    
    public function CategorieDelete(Request $request, $idCategorie)
    {
		$idMaitresseCreatrice = JWTAuth::parseToken()->getPayload()["sub"];
		
		if (!IsValidID($idCategorie))
			return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);
		
		$result = DB::delete('DELETE FROM `categorie` WHERE `idCategorie` =? AND `idMaitresseCreatrice` =?', [$idFiche, $idMaitresseCreatrice]);
		
		if ($result == 0) 
			return response()->json(["code" => "404", "message" => "Data Not Found"], 404);
		
		return response()->json(["code" => "200", "message" => "OK"], 200);
    }
    
    public function CategorieGet(Request $request, $idCategorie)
    {
		$idMaitresseCreatrice = JWTAuth::parseToken()->getPayload()["sub"];
		
        if (!IsValidID($idCategorie))
            return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);
        
        $result = DB::select('
            SELECT * FROM `categorie`
            WHERE (`idCategorie` = ?) AND
			(`estPublic` = 1 OR `idMaitresseCreatrice` =?)',
            [$idCategorie, $idMaitresseCreatrice]);
        
        if ($result == null) 
        {
            return response()->json(["code" => "404", "message" => "Data Not Found"], 404);
        }
        
        return response()->json($result[0], 200);
    }
	
    public function CategorieSet(Request $request, $idCategorie)
    {
		$body = json_decode($request->getContent());
		
		$idMaitresse = JWTAuth::parseToken()->getPayload()["sub"];
		
		$numberAffected = 0;
		
		try
		{
			DB::beginTransaction();
			if(isset($body->nom))
			{
				$numberAffected++;
				DB::update('
					UPDATE `categorie` 
					SET `nom` =?
					WHERE `idMaitresseCreatrice` =?',
					[$body->nom,$idMaitresse]);
			}
			
			if(isset($body->matiere))
			{
				$numberAffected++;
				DB::update('
					UPDATE `categorie` 
					SET `matiere` =?
					WHERE `idMaitresseCreatrice` =?',
					[$body->matiere,$idMaitresse]);
			}
			
			if(isset($body->niveau))
			{
				$numberAffected++;
				DB::update('
					UPDATE `categorie` 
					SET `niveau` =?
					WHERE `idMaitresseCreatrice` =?',
					[$body->niveau,$idMaitresse]);
			}
			
			if(isset($body->estPublic))
			{
				$numberAffected++;
				DB::update('
					UPDATE `categorie` 
					SET `estPublic` =?
					WHERE `idMaitresseCreatrice` =?',
					[$body->estPublic,$idMaitresse]);
			}
			
			DB::commit();
		}
		catch (Exception $e)
		{
			DB::rollBack();
			return response()->json(['code' => 500 ,'message' => 'Could Not Update'], 500);
		}

		return response()->json(['code' => 200 ,'message' => $numberAffected.' Variable(s) Affected'] , 200);
    }
    
    public function CategorieGetList(Request $request, $page = 1)
    {
		$idMaitresseCreatrice = JWTAuth::parseToken()->getPayload()["sub"];
		
		if (!IsValidID($page))
			return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);

		return response()->json(DB::select('
			SELECT * FROM `categorie` 
			WHERE `estPublic` = 1 OR `idMaitresseCreatrice` =? 
			LIMIT ?,30',[$idMaitresseCreatrice, ($page * 30) - 30]), 200);

    }

    public function FicheCreation(Request $request)
    {
		$body = json_decode($request->getContent());
		
		$idFiche = $body->idFiche;
		$idCategorie = $body->idCategorie;
		$titre = $body->titre;		
		$listeQuestion = $body->listeQuestion;
		
		$idMaitresseCreatrice = JWTAuth::parseToken()->getPayload()["sub"];
		
		if (!isset($idFiche, $idCategorie, $titre, $listeQuestion))
			return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);
		
		try
		{
			DB::beginTransaction();
			
			DB::insert('
				INSERT INTO `fiche`
				(`idFiche`, `idCategorie`, `titre`, `idMaitresseCreatrice`) 
				VALUES (?,?,?,?)', [$idFiche, $idCategorie, $titre, $idMaitresseCreatrice]);

			$failed = false;
			$i = 1;
			foreach ($listeQuestion as $question)
			{
				if (!isset($question->question, $question->choixDeReponses, question->bonneReponse))
				{
					$failed = true;
					break;
				}
				DB::insert('
					INSERT INTO `question`
					(`idQuestion`, `idFiche`, `idCategorie`, `question`, `choixDeReponses`, `bonneReponse`)
					VALUES (?,?,?,?,?,?)',
					[$i, $idFiche, $idCategorie, $question->question, $question->choixDeReponses, $question->bonneReponse]);
					
				$i++;
			}
			
			if ($failed)
			{
				DB::rollBack();
				return response()->json(["code" => "400", "message" => "Invalid Parameter in listeQuestion"], 400);
			}
			else
				DB::commit();
		}
		catch (Exception $e)
		{
			DB::rollBack();
			return response()->json(['code' => 500 ,'message' => 'Could Not Create'], 500);
		}
		
		return response()->json(["code" => "200", "message" => "OK"], 200);
    }
    
    public function FicheDelete(Request $request, $idCategorie, $idFiche)
    {
		$idMaitresseCreatrice = JWTAuth::parseToken()->getPayload()["sub"];
		
		if (!IsValidID($idCategorie) || !IsValidID($idFiche))
			return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);
		
		$result = DB::delete('
			DELETE FROM `fiche` 
			WHERE `idFiche` =? AND `idCategorie` =? AND `idMaitresseCreatrice` =? ', [$idFiche, $idCategorie, $idMaitresseCreatrice]);
		
		if ($result == 0) 
			return response()->json(["code" => "404", "message" => "Data Not Found"], 404);
		
		return response()->json(["code" => "200", "message" => "OK"], 200);
    }
    
    public function FicheGet(Request $request, $idCategorie, $idFiche)
    {
		$idMaitresseCreatrice = JWTAuth::parseToken()->getPayload()["sub"];
		
        if (!IsValidID($idCategorie) || !IsValidID($idFiche))
            return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);
         
        $fiche = new Fiche();
         
        $result = DB::select('
            SELECT * FROM `fiche`
            WHERE `idFiche`  ? AND `idCategorie` = ? AND
			(`estPublic` = 1 OR `idMaitresseCreatrice` =?)',
            [$idFiche ,$idCategorie, $idMaitresseCreatrice]);
         
        if ($result == null) 
        {
            return response()->json(["code" => "404", "message" => "Data Not Found"], 404);
        }
         
        $fiche->idFiche = $result[0]->idFiche;
        $fiche->idCategorie = $result[0]->idCategorie;
        $fiche->titre = $result[0]->titre;
        $fiche->dateCreation = $result[0]->dateCreation;
        $fiche->idMaitresseCreatrice = $result[0]->idMaitresseCreatrice;
 
        $fiche->listeQuestion = DB::select('
            SELECT *
            FROM `question`
            WHERE `idFiche`=? AND
            `idCategorie`=?', [$idFiche ,$idCategorie]);
             
        return response()->json($fiche, 200);
    }
    
	public function FicheSet(Request $request, $idCategorie, $idFiche)
    {
		$body = json_decode($request->getContent());
		
		$idMaitresse = JWTAuth::parseToken()->getPayload()["sub"];
		
		$numberAffected = 0;
		
		try
		{
			DB::beginTransaction();
			if(isset($body->nom))
			{
				$numberAffected++;
				DB::update('
					UPDATE `categorie` 
					SET `nom` =?
					WHERE `idMaitresseCreatrice` =?',
					[$body->nom,$idMaitresse]);
			}
			
			if(isset($body->matiere))
			{
				$numberAffected++;
				DB::update('
					UPDATE `categorie` 
					SET `matiere` =?
					WHERE `idMaitresseCreatrice` =?',
					[$body->matiere,$idMaitresse]);
			}
			
			if(isset($body->niveau))
			{
				$numberAffected++;
				DB::update('
					UPDATE `categorie` 
					SET `niveau` =?
					WHERE `idMaitresseCreatrice` =?',
					[$body->niveau,$idMaitresse]);
			}
			
			if(isset($body->estPublic))
			{
				$numberAffected++;
				DB::update('
					UPDATE `categorie` 
					SET `estPublic` =?
					WHERE `idMaitresseCreatrice` =?',
					[$body->estPublic,$idMaitresse]);
			}
			
			if(isset($body->listeQuestion))
			{
				foreach ($body->listeQuestion as $question)
				{
					if (isset($question->idQuestion, $question->idFiche, $question->idCategorie, $question->question, $question->choixDeReponses, question->bonneReponse))
					{
						$numberAffected++;
						DB::insert('
							UPDATE `question` 
							SET `quesion` =?,`choixDeReponses` =?,`bonneReponse` =? 
							WHERE `idQuestion` =?,`idFiche` =?,`idCategorie` =?',
							[$question->question, $question->choixDeReponses, $question->bonneReponse, $question->idQuestion, $question->idFiche, $question->idCategorie]);
					}
				}
			}
			
			DB::commit();
		}
		catch (Exception $e)
		{
			DB::rollBack();
			return response()->json(['code' => 500 ,'message' => 'Could Not Update'], 500);
		}

		return response()->json(['code' => 200 ,'message' => $numberAffected.' Variable(s) Affected'] , 200);
    }
	
    public function FicheGetList(Request $request, $page = 1)
    {
		$idMaitresseCreatrice = JWTAuth::parseToken()->getPayload()["sub"];
		
		if (!IsValidID($page))
			return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);

		return response()->json(DB::select('
			SELECT * FROM `fiche` 
			WHERE `estPublic` = 1 OR `idMaitresseCreatrice` =? 
			LIMIT ?,30',[$idMaitresseCreatrice, ($page * 30) - 30]), 200);
    }
    
	public function FicheGetListCategorie(Request $request, $page = 1, $idCategorie)
	{
		$idMaitresseCreatrice = JWTAuth::parseToken()->getPayload()["sub"];
		
		if (!IsValidID($page))
			return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);

		return response()->json(DB::select('
			SELECT * FROM `fiche` 
			WHERE `idCategorie` =?` AND (estPublic` = 1 OR `idMaitresseCreatrice` =? )
			LIMIT ?,30',[$idCategorie, $idMaitresseCreatrice, ($page * 30) - 30]), 200);
	}
	
    public function UserCreation(Request $request)
    {
		/////////////////////////////////////////////////////////////////////////////////////////////////////////HOLD Maitraisse Eleve
		//////////////////////////////////////ASSOCIATION ELEVE avec ADMIN
		$body = json_decode($request->getContent());
		
		$idMaitresse = JWTAuth::parseToken()->getPayload()["sub"];
 
		$prenom = $body->prenom;
		$nom = $body->nom;
		$dateNaissance = $body->dateNaissance;
		$genre = $body->genre;
		$avatar = $body->avatar;

		if (!isset($prenom, $nom, $dateNaissance, $genre, $avatar))
			return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);
		
		DB::insert('
			INSERT INTO `eleve` 
			(`prenom`, `nom`, `dateNaissance`, `genre`, `avatar`) 
			VALUES (?,?,?,?,?)', [$prenom, $nom, $dateNaissance, $genre, $avatar]);
		
		//////////////////////////////////////INSERT CLASSE ELEVE
		
		return response()->json(["code" => "200", "message" => "OK"], 200);
	}
    
    public function UserDelete(Request $request, $idEleve)
    {
		/////////////////////////////////////////////////////////////////////////////////////////////////////////HOLD Maitraisse Eleve
		//////////////////////////////////////SELON LA CLASSE DE LADMIN
		$idMaitresse = JWTAuth::parseToken()->getPayload()["sub"];
		
		if (!IsValidID($idEleve))
			return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);
		
		$result = DB::delete('DELETE FROM `classe_eleve_maitresse` WHERE `idMaitresse` =? `idEleve` =?', [$idMaitresse, $idEleve]);
		
		if ($result == 0) 
			return response()->json(["code" => "404", "message" => "Data Not Found"], 404);
		
		return response()->json(["code" => "200", "message" => "OK"], 200);
    }
    
    public function UserGet(Request $request, $idEleve)
    {
		/////////////////////////////////////////////////////////////////////////////////////////////////////////HOLD Maitraisse Eleve
		//////////////////////////////////////SELON LA CLASSE DE LADMIN
		$idMaitresse = JWTAuth::parseToken()->getPayload()["sub"];
		
		if (!IsValidID($idEleve))
			return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);
		
		$result = DB::select('
			SELECT `eleve`.`idEleve`, `prenom`, `nom`, `dateNaissance`, `genre`, `avatar` 
			FROM `eleve` 
			JOIN `classe_eleve_maitresse` ON `classe_eleve_maitresse`.`idEleve` = `eleve`.`idEleve`
			WHERE `eleve`.`idEleve` =? AND `classe_eleve_maitresse`.`idMaitresse` =?',[$idEleve, $idMaitresse]);
		
		if ($result == null) 
			return response()->json(["code" => "404", "message" => "Data Not Found"], 404);
		
		return response()->json($result[0], 200); 
    }
    
    public function UserGetList(Request $request, $page = 1)
    {
		/////////////////////////////////////////////////////////////////////////////////////////////////////////HOLD Maitraisse Eleve
		//////////////////////////////////////SELON LA CLASSE DE LADMIN?????????????????????????????????
		$idMaitresse = JWTAuth::parseToken()->getPayload()["sub"];
		
		if (!IsValidID($page))
			return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);

		return response()->json(DB::select('
			SELECT `eleve`.`idEleve`, `classe_eleve_maitresse`.`idMaitresse`, `prenom`, `nom`, `genre`, `avatar`
			FROM `eleve` 
			JOIN `classe_eleve_maitresse` ON `classe_eleve_maitresse`.`idEleve` = `eleve`.`idEleve`
			LIMIT ?,30',[($page * 30) - 30]), 200); 
    }
    
    public function Historique(Request $request, $page = 1)
    {
		/////////////////////////////////////////////////////////////////////////////////////////////////////////HOLD Maitraisse Eleve
		//////////////////////////////////////SELON LA CLASSE DE LADMIN
		$idMaitresse = JWTAuth::parseToken()->getPayload()["sub"];
		
		if (!IsValidID($page))
			return response()->json(["code" => "400", "message" => "Invalid Parameter"], 400);

		return response()->json(DB::select('SELECT * FROM `historique` LIMIT ?,30',[($page * 30) - 30]), 200); 
    }
	
	protected function IsValidID($var)
    {
		if ($var <= 0 || $var > 2147483647 || $var == null)
			return false;

		return true; 
    }
}
